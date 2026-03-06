import test from "node:test";
import assert from "node:assert/strict";

import {
  buildRenderModel,
  createStampState,
  formatDimensions,
  getAspectRatioOption,
  getFontOption,
  getTextSizeOption,
  resolveImageCrop,
  resolveOutputSize,
  resolveTextLayout
} from "../../src/caption/render.js";

test("createStampState merges overrides over defaults", () => {
  const state = createStampState({
    topCaption: "hello up",
    caption: "hello",
    aspectRatioId: "4:5"
  });

  assert.equal(state.topCaption, "hello up");
  assert.equal(state.caption, "hello");
  assert.equal(state.aspectRatioId, "4:5");
  assert.equal(state.fontId, "rubik-bold");
});

test("getAspectRatioOption falls back to original", () => {
  assert.equal(getAspectRatioOption("missing").id, "original");
});

test("getFontOption falls back to first configured font", () => {
  assert.equal(getFontOption("missing").label, "Rubik Bold");
});

test("getTextSizeOption falls back to medium", () => {
  assert.equal(getTextSizeOption("missing").id, "medium");
});

test("resolveOutputSize preserves the original image size", () => {
  assert.deepEqual(resolveOutputSize(800, 600, "original"), { width: 800, height: 600 });
});

test("resolveOutputSize crops landscape image into portrait 4:5 frame", () => {
  assert.deepEqual(resolveOutputSize(800, 600, "4:5"), { width: 480, height: 600 });
});

test("resolveOutputSize crops portrait image into landscape 3:2 frame", () => {
  assert.deepEqual(resolveOutputSize(600, 900, "3:2"), { width: 600, height: 400 });
});

test("resolveOutputSize rejects invalid source dimensions", () => {
  assert.throws(() => resolveOutputSize(0, 900, "3:2"), /positive numbers/);
});

test("resolveImageCrop preserves full image when ratios already match", () => {
  assert.deepEqual(resolveImageCrop(800, 600, 400, 300), {
    sx: 0,
    sy: 0,
    sw: 800,
    sh: 600
  });
});

test("resolveImageCrop center-crops landscape image for portrait output", () => {
  assert.deepEqual(resolveImageCrop(800, 600, 480, 600), {
    sx: 160,
    sy: 0,
    sw: 480,
    sh: 600
  });
});

test("resolveImageCrop center-crops portrait image for landscape output", () => {
  assert.deepEqual(resolveImageCrop(600, 900, 600, 400), {
    sx: 0,
    sy: 250,
    sw: 600,
    sh: 400
  });
});

test("resolveTextLayout scales typography by preset", () => {
  const small = resolveTextLayout(1080, 1350, "small");
  const large = resolveTextLayout(1080, 1350, "large");

  assert.ok(large.fontSize > small.fontSize);
  assert.ok(large.lineHeight > small.lineHeight);
  assert.equal(large.maxLines, 4);
});

test("buildRenderModel trims caption and resolves output settings", () => {
  const state = createStampState({
    topCaption: "  headline above  ",
    caption: "  the cat invests in petals  ",
    fontId: "comfortaa-bold",
    textSizeId: "large",
    aspectRatioId: "4:5"
  });

  const model = buildRenderModel(state, { width: 800, height: 600 });

  assert.equal(model.topCaption, "headline above");
  assert.equal(model.bottomCaption, "the cat invests in petals");
  assert.equal(model.font.label, "Comfortaa Bold");
  assert.equal(model.textSize.id, "large");
  assert.deepEqual(model.output, { width: 480, height: 600 });
  assert.deepEqual(model.crop, { sx: 160, sy: 0, sw: 480, sh: 600 });
  assert.equal(model.gradients.top.heightRatio, 0.42);
  assert.equal(model.gradients.bottom.heightRatio, 0.48);
  assert.ok(model.textLayout.fontSize > 0);
});

test("buildRenderModel marks empty top and bottom captions as disabled layers", () => {
  const model = buildRenderModel(
    createStampState({ topCaption: "   ", caption: "   " }),
    { width: 1080, height: 1350 }
  );

  assert.equal(model.topCaption, "");
  assert.equal(model.bottomCaption, "");
  assert.equal(model.hasTopCaption, false);
  assert.equal(model.hasBottomCaption, false);
});

test("buildRenderModel rejects missing image metadata", () => {
  assert.throws(() => buildRenderModel(createStampState(), null), /Image metadata/);
});

test("formatDimensions returns WxH label", () => {
  assert.equal(formatDimensions({ width: 1080, height: 1350 }), "1080x1350");
});
