# `caption` Specification

## Status

Draft for first implementation.

## Overview

`caption` is a standalone web tool for turning an image into a text card.

It is based on the behavior of an existing Telegram bot, but the interface must be native to the web: one screen, live preview, direct controls, no chat-like flow.

The production tool should be delivered as a self-contained HTML page that can be opened directly without a build step.

## Goal

The user uploads an image, enters top and/or bottom caption text, adjusts a small set of styling options, previews the result immediately, and downloads the final card as an image.

## Product Principles

- Narrow tool, not a universal editor.
- Fast, direct interaction on one screen.
- Result-first interface: preview is more important than controls.
- Predictable output with minimal configuration.
- Close to the Telegram bot in functionality, but not in interface shape.

## Scope

### Included in `v1`

- Upload one image.
- Enter bottom caption text.
- Optionally enter top caption text.
- Choose one of 8 text fonts.
- Choose one of 3 text size presets.
- Choose card aspect ratio.
- Show live preview.
- Export final image.

### Excluded from `v1`

- User logo / watermark support.
- Manual text positioning.
- Arbitrary text styling controls.
- Multi-step chat-like workflow.
- Extra automatic cards based on words like `Реклама` or `erid`.

## Core User Flow

1. User opens `caption.html`.
2. User uploads an image.
3. User enters bottom caption text and optionally top caption text.
4. User optionally changes font, text size, and card aspect ratio.
5. Preview updates on the same screen.
6. User downloads the generated card.

## Card Composition

- The uploaded image is the base layer.
- A dark bottom gradient is drawn over the lower area of the image.
- An additional dark top gradient may be drawn over the upper area when top caption text is present.
- Bottom caption text is placed over the lower gradient.
- Optional top caption text is placed over the upper gradient.
- Text must remain readable on different image backgrounds.
- The visual model should stay close to the Telegram bot examples for the lower caption, while allowing a meme-like top caption when needed.

## Text Options

### Fonts

The tool must provide these 8 options:

- Rubik Bold
- PT Sans Bold
- Comfortaa Bold
- Bad Script
- Neucha
- Caveat Bold
- Marmelad
- Pangolin

### Text Size Presets

The tool must provide these 3 presets:

- Small
- Medium
- Large

For `v1`, the preset must affect at least font size.

It may later also affect:

- line height;
- text block spacing;
- internal text margins.

## Card Aspect Ratio

The tool must provide these options:

- Same as image
- 4:5
- 3:2
- 2:3
- 9:16

Behavior:

- `Same as image` preserves the original uploaded image ratio.
- Fixed ratio options adapt the image into the selected output frame while preserving a clean composition.

## Interface Requirements

`caption` must use a web-native layout rather than Telegram-like interaction.

Implementation constraint:

- the production tool should remain a self-contained HTML page;
- if tests or helper modules exist during development, they must not be required to run the tool.

The page must include:

- image upload area;
- top caption input;
- bottom caption input;
- font selection controls;
- text size selection controls;
- aspect ratio selection controls;
- live preview area;
- download action.

Interaction rules:

- image and text controls are visible on the same screen;
- no “send image first, send text later” flow;
- settings should be compact and understandable without extra steps;
- desktop and mobile layouts must both be usable.

## Design Principles

### Project-Level Direction

The whole project should feel like a family of small, independent web tools with one visual language.

Required qualities:

- minimalistic;
- visually light;
- not overloaded;
- not framework-heavy in implementation or in appearance;
- not sterile black text on white background;
- consistent across tools.

### Visual Direction

The design direction is inspired by [DeFi Visualized](https://expectfun.github.io/defi-visualized):

- atmospheric background instead of flat blank fill;
- limited palette with one primary accent color;
- clean hierarchy;
- subtle panels and borders;
- moderate corner radius;
- restrained hover and focus states;
- no decorative clutter.

### `caption` Page Direction

`caption` should feel like a creator utility, not a bot wrapper.

The page should emphasize:

- the preview as the main object;
- compact settings;
- visual clarity;
- a cohesive, polished look even in `v1`.

The page should avoid:

- Telegram imitation;
- bulky control groups;
- noisy decoration;
- a generic admin-panel look.

## Layout Guidance

Preferred structure:

- page title and short description;
- main workspace with preview;
- compact settings panel;
- clear download button.

Layout constraints:

- desktop layout should stay composed and not stretch aimlessly across the screen;
- mobile layout should stack cleanly into a vertical flow;
- preview should remain visually dominant.

## Future Work

The following is intentionally postponed, but must be tracked:

- user logo upload;
- logo placement in the top-right corner of the card;
- logo removal/replacement;
- more advanced customization controls.

## Success Criteria For `v1`

`caption` is ready for first release when a user can:

- upload an image;
- enter a bottom caption;
- optionally enter a top caption;
- switch between available fonts;
- switch between text size presets;
- switch between aspect ratio presets;
- see a stable live preview;
- download the resulting image.

## Notes

- Visual references live in `docs/caption/references/`.
- The product naming direction is `caption`; docs and structure should converge on that name.
- The preferred production format is a self-contained `caption.html` tool.
