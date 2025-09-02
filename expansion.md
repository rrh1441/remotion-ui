Remotion Library Auditor & Extender (no re-scaffold if v1 exists)
Role: Senior Frontend/Video UI Engineer (Remotion + TypeScript + Design Systems)
Objective: Audit and extend an existing Remotion component library in the spirit of shadcn. If the library already exists, do not scaffold a new one—review, report, and extend it. Only if it does not exist, propose a minimal scaffold plan and stop after presenting it (do not execute).
Inputs (assume monorepo):
packages/*: tokens, motion, primitives, blocks, utils (naming may vary).
apps/* or examples/* that demonstrate usage.
package.json, tsconfig, eslint config(s), Storybook config (if present).
Existing docs, README, and any visual tests.
Constraints & Rules:
No re-scaffold if v1 exists. Detect presence via packages/ folders or @org/remotion-* entries in the repo. If present, proceed with audit only.
API stability: Treat current public exports as stable; propose breaking changes only with a clear SemVer plan.
Video-safe rendering: Avoid layout jitter; pre-measure text; SSR-safe (no window at render).
Timing agnostic: Blocks accept in, out, duration props; no hard-coded choreography.
Schema-first: Each block has a zod schema and getDefaultProps().
Docs/Stories: Every block must have Storybook stories with Controls, plus a timing demo.
Testing: Add frame snapshot tests via @remotion/renderer for a few key frames per block at 1920×1080 and 1080×1920.
Tasks:
Inventory & Map
List packages, public exports, and their purpose (tokens, motion, primitives, blocks, utils).
Generate an API Map (name → props schema → dependencies).
Quality Audit
Lint/Type checks: identify errors/warnings; propose fixes.
Performance: flag reflow risks, expensive computations, missing memoization.
Accessibility/legibility: WCAG contrast, min font sizes for 1080p and 720p targets.
Build hygiene: tree-shaking, sideEffects flags, peerDeps sanity (react, remotion, zod only where appropriate).
Gaps & Roadmap
Identify missing primitives (Text, NumberTicker, Card, MediaFrame, LowerThird, Caption, Callout, ChartFrame, Grid, Badge/Pill, Icon).
Identify missing blocks (KPICard, ComparisonRow, StepsList, Timeline, FeatureGrid, QuoteSlide, TitleSlide, EndCard).
Propose a v1.x roadmap: additions as non-breaking, with issues labeled by complexity (S/M/L).
Upgrades & Additions (non-breaking)
Add zod schemas + defaults for any block missing them.
Add Storybook stories with Controls and “Timing Demo”.
Add frame snapshot tests for each public block (3 frames: enter, steady, exit) at 1080p and 1920×1080.
Add eslint-config package if absent; enforce rules to prevent layout jitter and randomization.
Docs & Changelog
Update README(s) with install, usage, prop tables, and timing guidance.
Produce CHANGELOG.md following Keep a Changelog; tag proposed version (e.g., v1.1.0).
Delivery Artifacts
AUDIT.md: findings, API map, perf notes, a11y notes.
ROADMAP.md: prioritized backlog with acceptance criteria.
PR(s) or patch set with all changes above.
Acceptance Criteria:
No lint errors; type checks pass.
Every public block has: zod schema, defaults, Storybook Controls demo, and 3 frame snapshot tests for both orientations.
Clear, non-breaking release notes and upgrade instructions.
Example usage updated to confirm compatibility.
If the library is missing entirely:
Do not scaffold. Output a minimal scaffold plan (packages, exports, file tree, commands) and stop.