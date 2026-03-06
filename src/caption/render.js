export const FONT_OPTIONS = [
  { id: "rubik-bold", label: "Rubik Bold", fontFamily: '"Rubik", "Segoe UI", sans-serif' },
  { id: "pt-sans-bold", label: "PT Sans Bold", fontFamily: '"PT Sans", "Segoe UI", sans-serif' },
  { id: "comfortaa-bold", label: "Comfortaa Bold", fontFamily: '"Comfortaa", "Segoe UI", sans-serif' },
  { id: "bad-script", label: "Bad Script", fontFamily: '"Bad Script", "Segoe UI", cursive' },
  { id: "neucha", label: "Neucha", fontFamily: '"Neucha", "Segoe UI", cursive' },
  { id: "caveat-bold", label: "Caveat Bold", fontFamily: '"Caveat", "Segoe UI", cursive' },
  { id: "marmelad", label: "Marmelad", fontFamily: '"Marmelad", "Segoe UI", sans-serif' },
  { id: "pangolin", label: "Pangolin", fontFamily: '"Pangolin", "Segoe UI", cursive' }
];

export const TEXT_SIZE_OPTIONS = [
  { id: "small", label: "Small", scale: 0.72 },
  { id: "medium", label: "Medium", scale: 1 },
  { id: "large", label: "Large", scale: 1.28 }
];

export const ASPECT_RATIO_OPTIONS = [
  { id: "original", label: "Same as image", width: null, height: null },
  { id: "4:5", label: "4:5", width: 4, height: 5 },
  { id: "3:2", label: "3:2", width: 3, height: 2 },
  { id: "2:3", label: "2:3", width: 2, height: 3 },
  { id: "9:16", label: "9:16", width: 9, height: 16 }
];

export const DEFAULT_STATE = Object.freeze({
  image: null,
  topCaption: "",
  caption: "",
  fontId: FONT_OPTIONS[0].id,
  textSizeId: TEXT_SIZE_OPTIONS[1].id,
  aspectRatioId: ASPECT_RATIO_OPTIONS[0].id
});

export function createStampState(overrides = {}) {
  return {
    ...DEFAULT_STATE,
    ...overrides
  };
}

export function getAspectRatioOption(id) {
  return ASPECT_RATIO_OPTIONS.find((option) => option.id === id) ?? ASPECT_RATIO_OPTIONS[0];
}

export function getFontOption(id) {
  return FONT_OPTIONS.find((option) => option.id === id) ?? FONT_OPTIONS[0];
}

export function getTextSizeOption(id) {
  return TEXT_SIZE_OPTIONS.find((option) => option.id === id) ?? TEXT_SIZE_OPTIONS[1];
}

export function resolveOutputSize(sourceWidth, sourceHeight, aspectRatioId = "original") {
  if (!Number.isFinite(sourceWidth) || !Number.isFinite(sourceHeight) || sourceWidth <= 0 || sourceHeight <= 0) {
    throw new Error("Source image dimensions must be positive numbers.");
  }

  const ratio = getAspectRatioOption(aspectRatioId);

  if (!ratio.width || !ratio.height) {
    return { width: Math.round(sourceWidth), height: Math.round(sourceHeight) };
  }

  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = ratio.width / ratio.height;

  if (sourceRatio > targetRatio) {
    return { width: Math.round(sourceHeight * targetRatio), height: Math.round(sourceHeight) };
  }

  return { width: Math.round(sourceWidth), height: Math.round(sourceWidth / targetRatio) };
}

export function resolveImageCrop(sourceWidth, sourceHeight, outputWidth, outputHeight) {
  if (
    !Number.isFinite(sourceWidth) ||
    !Number.isFinite(sourceHeight) ||
    !Number.isFinite(outputWidth) ||
    !Number.isFinite(outputHeight) ||
    sourceWidth <= 0 ||
    sourceHeight <= 0 ||
    outputWidth <= 0 ||
    outputHeight <= 0
  ) {
    throw new Error("Image crop dimensions must be positive numbers.");
  }

  const sourceRatio = sourceWidth / sourceHeight;
  const outputRatio = outputWidth / outputHeight;

  if (Math.abs(sourceRatio - outputRatio) < 0.0001) {
    return { sx: 0, sy: 0, sw: sourceWidth, sh: sourceHeight };
  }

  if (sourceRatio > outputRatio) {
    const sw = sourceHeight * outputRatio;
    return {
      sx: (sourceWidth - sw) / 2,
      sy: 0,
      sw,
      sh: sourceHeight
    };
  }

  const sh = sourceWidth / outputRatio;
  return {
    sx: 0,
    sy: (sourceHeight - sh) / 2,
    sw: sourceWidth,
    sh
  };
}

export function resolveTextLayout(outputWidth, outputHeight, textSizeId = "medium") {
  if (
    !Number.isFinite(outputWidth) ||
    !Number.isFinite(outputHeight) ||
    outputWidth <= 0 ||
    outputHeight <= 0
  ) {
    throw new Error("Text layout dimensions must be positive numbers.");
  }

  const textSize = getTextSizeOption(textSizeId);
  const base = Math.min(outputWidth, outputHeight);
  const horizontalPadding = Math.max(24, Math.round(outputWidth * 0.06));
  const bottomPadding = Math.max(28, Math.round(outputHeight * 0.06));
  const maxWidth = outputWidth - horizontalPadding * 2;
  const fontSize = Math.max(24, Math.round(base * 0.075 * textSize.scale));
  const lineHeight = Math.max(fontSize + 4, Math.round(fontSize * 1.12));
  const maxLines = outputHeight >= outputWidth ? 4 : 3;

  return {
    fontSize,
    lineHeight,
    horizontalPadding,
    bottomPadding,
    maxWidth,
    maxLines
  };
}

export function buildRenderModel(state, imageMeta) {
  if (!imageMeta || !Number.isFinite(imageMeta.width) || !Number.isFinite(imageMeta.height)) {
    throw new Error("Image metadata is required to build the render model.");
  }

  const output = resolveOutputSize(imageMeta.width, imageMeta.height, state.aspectRatioId);
  const font = getFontOption(state.fontId);
  const textSize = getTextSizeOption(state.textSizeId);

  return {
    hasTopCaption: state.topCaption.trim().length > 0,
    hasBottomCaption: state.caption.trim().length > 0,
    image: {
      width: imageMeta.width,
      height: imageMeta.height
    },
    output,
    crop: resolveImageCrop(imageMeta.width, imageMeta.height, output.width, output.height),
    topCaption: state.topCaption.trim(),
    bottomCaption: state.caption.trim(),
    font,
    textSize,
    textLayout: resolveTextLayout(output.width, output.height, state.textSizeId),
    gradients: {
      top: {
        from: "rgba(0, 0, 0, 0.88)",
        to: "rgba(0, 0, 0, 0)",
        heightRatio: 0.42
      },
      bottom: {
        from: "rgba(0, 0, 0, 0.88)",
        to: "rgba(0, 0, 0, 0)",
        heightRatio: 0.48
      }
    }
  };
}

export function formatDimensions({ width, height }) {
  return `${width}x${height}`;
}
