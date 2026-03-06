# `caption` Logs

## 2026-03-06

- Created initial documentation set: `spec.md`, `plan.md`, `logs.md`.
- Moved visual references into `docs/caption/references/`.
- Started implementation with standalone `caption.html`.
- Added initial module structure under `src/caption/`.
- Added first `node:test` coverage for pure rendering helpers.
- Collapsed the production tool into a single `caption.html` file with inline CSS and JS.
- Kept a small standalone render helper module under `src/caption/render.js` for tests.
- Updated `tool.md` to reflect the self-contained HTML-first project rule.
- Updated `spec.md` to explicitly require a self-contained production HTML tool.
- Added centered crop logic for fixed aspect ratios instead of naive image stretching.
- Added export from preview canvas to PNG download.
- Improved text layout model with explicit spacing, max lines, and truncation.
- Expanded tests for crop and text layout helpers.
- Vendored the 8 required fonts locally under `assets/fonts/`.
- Connected `caption.html` to local font files via `@font-face`.
- Polished the UI with stronger empty state, clearer status messaging, and more deliberate control styling.
- Added live ratio/status cues so the page feels less like a raw prototype.
- Fixed preview canvas sizing so on-page aspect ratios stop lying while export stays unchanged.
- Reworked the empty preview state so the central area offers a direct `Browse` action instead of dead decorative copy.
- Removed extra self-commentary from the page header and controls area to keep the UI terser.
- Simplified the empty preview state further by removing explanatory filler under the main prompt.
- Removed low-value field hints and the developer-facing status row from the controls panel.
- Added optional top caption support with shared font settings and a matching top gradient.
- Fixed lazy webfont races by waiting for the selected font before canvas re-render.
- Made top and bottom gradients conditional: empty caption fields now produce no text layer and no gradient.
- Switched both top and bottom caption rendering to centered alignment.
- Added export format selection with both PNG and JPG output paths.
- Removed the controls-panel status line and made JPG the default export format.
- Replaced the large multiline caption fields with compact single-line text inputs.
- Aligned the field naming to `Top caption` / `Bottom caption`.
- Added a bit more breathing room between the empty-state headline and the `Browse` button.
- Reordered export formats so the default `JPG` option appears first in the list.
- Renamed the main action from `Download card` to `Download image` to keep the tool less narrowly framed.
- Renamed the tool from `stamp` to `caption` across files, docs, tests, and paths.
- Widened the empty preview state so the heading wraps into a calmer two-line block.
- Current state: production tool is one HTML file, rendering model is testable, and the UI is moving from raw shell toward a coherent first product pass.
