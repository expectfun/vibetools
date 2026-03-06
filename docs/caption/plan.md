# `caption` Implementation Plan

## Status

Draft implementation plan for `v1`.

## Goal

Build the first working version of `caption` as a standalone HTML tool with live preview and image export, following the requirements from [`spec.md`](./spec.md).

## Delivery Strategy

Development should follow TDD:

1. write a failing test;
2. implement the minimum needed behavior;
3. refactor without breaking passing tests.

The first version should prioritize a stable rendering pipeline and a coherent interface over extra customization.

## Milestone 1: Project Skeleton

### Outcome

Create the minimum file structure needed to build and test the tool.

### Tasks

- Create `caption.html` as the standalone entry page.
- Create the JavaScript module(s) used by the page.
- Create initial test files and test runner setup.
- Decide where rendering logic lives so it can be tested outside the UI layer.

### Done When

- The page opens locally.
- Tests can be executed.
- Rendering logic is not trapped inside ad hoc DOM event handlers.

## Milestone 2: Rendering Core

### Outcome

Implement the pure rendering pipeline that generates the final card from input settings.

### Tasks

- Define a rendering input model:
  - source image;
  - caption text;
  - selected font;
  - selected text size preset;
  - selected aspect ratio.
- Implement canvas-based rendering for:
  - base image placement;
  - aspect ratio framing;
  - bottom gradient overlay;
  - caption drawing.
- Keep rendering code deterministic enough to test.

### Tests

- Rendering returns an output canvas or image blob.
- `Same as image` preserves the input ratio.
- Fixed ratio modes produce the expected output dimensions.
- Gradient overlay is applied in the lower area.
- Empty or short text does not break rendering.

### Done When

- A valid image can be generated from structured input without depending on UI interaction.

## Milestone 3: Typography Presets

### Outcome

Support the required font and text size options.

### Tasks

- Register the 8 required text styles in the UI and rendering layer.
- Implement `Small`, `Medium`, and `Large` presets.
- Define text layout rules:
  - max width;
  - line wrapping;
  - line height;
  - bottom and side padding.
- Ensure text stays readable over the gradient.

### Tests

- Each font option maps to the correct rendering configuration.
- Each text size preset changes text sizing predictably.
- Long captions wrap instead of overflowing outside the card.
- Multi-line text stays inside the visible text zone.

### Done When

- Users can switch font and size presets and get stable, visibly different results.

## Milestone 4: Interface

### Outcome

Build the actual `caption` page around the rendering core.

### Tasks

- Add image upload control.
- Add caption input.
- Add font selector.
- Add text size selector.
- Add aspect ratio selector.
- Add preview area.
- Add download button.
- Connect controls to live preview updates.

### UI Requirements

- One-screen workflow.
- Preview is visually dominant.
- Controls stay compact.
- No Telegram-like step flow.
- Desktop and mobile layouts both work.

### Tests

- Uploading an image updates preview state.
- Changing text updates preview.
- Changing font, text size, and ratio updates preview.
- Download action produces a file from the current state.

### Done When

- A user can complete the full `v1` flow from upload to download in one page session.

## Milestone 5: Visual Polish

### Outcome

Make the first version look like a deliberate product rather than a raw prototype.

### Tasks

- Apply the shared visual direction from the spec.
- Create a clean layout with clear hierarchy.
- Style panels, inputs, buttons, and selection states consistently.
- Design the empty state before an image is uploaded.
- Tune spacing, contrast, and responsive behavior.

### Review Checklist

- The page feels minimal, not empty.
- The page has character, not generic admin styling.
- The preview remains the main focus.
- The controls are readable and calm.
- Mobile layout is not an afterthought.

### Done When

- `caption` feels visually coherent and aligned with the project direction.

## Milestone 6: Final Verification

### Outcome

Verify that `v1` matches the specification and does not regress on basic flows.

### Tasks

- Run the full test suite.
- Manually verify all supported controls.
- Check export output on representative images.
- Compare result quality against the Telegram bot references.
- Record important implementation notes in `logs.md`.

### Done When

- Core flows are working.
- Tests pass.
- Known limitations are documented.

## Open Decisions

These items may need refinement during implementation:

- exact output dimensions for exported images;
- image fitting strategy for fixed aspect ratios;
- exact numeric values for text size presets;
- exact font loading strategy in a standalone HTML environment;
- whether preview rendering should be debounced for large images.

## Explicit Non-Goals For `v1`

- logo upload and placement;
- advanced styling controls;
- multiple text blocks;
- drag-and-drop text positioning;
- chat-like interaction model;
- automation based on special words in caption text.
