Below is a **single, comprehensive prompt** you can hand to an autonomous agent. It defines scope, deliverables, directory trees, APIs, code standards, tests, and acceptance criteria for building a “shadcn for Remotion” with an ambitious v0.1 asset set.

---

# PROMPT FOR AGENT

## Mission

Build **Remotion-UI**, a **source-first** component, asset, and preset system for Remotion (think “shadcn for motion”). Deliver a copy-in **CLI** that installs TypeScript components, aspect-ratio presets with safe-areas, and versioned asset packs (icons, characters, shapes, backgrounds) into any Remotion project. Provide optional runtime packages and an eject path.

## Success Criteria (Definition of Done)

1. **CLI** (`@remotion-ui/cli`) publishes to npm and supports:

   * `init` (tokens, ThemeProvider, presets, Tailwind mapping optional)
   * `add <components...>` (copy TSX files)
   * `add assets <packs...>` (copy `/public/assets` + `manifest.json`)
   * `add-preset <ids...>` (scaffold demo compositions)
   * Idempotent, safe, lint-clean output. No TODOs.
2. **Components & primitives** compile in a fresh Remotion app with zero type or lint errors and render correctly.
3. **Assets**: v0.1 ships with **70+ usable assets** (details below), a validated **manifest.json**, and a React loader that resolves assets by id and variant.
4. **Docs** site builds and deploys (Next.js) with live Remotion Player demos.
5. **Tests**: visual regression for at least 6 components, unit coverage for loaders and prop validation, CI green.

## Technical Constraints

* Language: **TypeScript** (strict). React 18. Remotion latest.
* Styling: inline styles + `className` pass-through (Tailwind optional).
* Validation: lightweight (optional) with `zod` (no runtime peer hard requirement).
* Lint: `eslint` + `@typescript-eslint` + `eslint-plugin-react(-hooks)`; zero warnings.
* Assets: **SVG** (icons/shapes), **JSON (Lottie)** for character micro-motions (idle blink), **WebP/PNG** only where needed; all referenced via **manifest.json**.
* No network calls at render time (assets local under `/public/assets`).

## Monorepo Structure (to produce)

```
remotion-ui/
├─ packages/
│  ├─ core/                      # motion/layout primitives + utils
│  ├─ components/                # composed components
│  ├─ themes/                    # tokens + ThemeProvider
│  ├─ assets/                    # manifest types + loader hook
│  └─ cli/                       # copy-in generator (shadcn-style)
├─ templates/                    # files the CLI copies into consumer apps
│  ├─ core/primitives/*.tsx
│  ├─ components/*.tsx
│  ├─ components/transitions/*.tsx
│  ├─ presets/AspectPresets.ts
│  ├─ presets/FramePreset.tsx
│  ├─ themes/ThemeProvider.tsx
│  ├─ examples/Root.tsx
│  └─ assets/                    # starter packs and manifest
│     ├─ manifest.json
│     ├─ icons/v1/{outline,solid}/*.svg
│     ├─ characters/v1/{mentor,analyst,engineer}/*.svg
│     ├─ characters/v1/lottie/*.json
│     ├─ shapes/v1/*.svg
│     └─ backgrounds/v1/{gradients,patterns,textures}/*.(svg|webp|png)
├─ apps/docs/                    # Next.js docs site with Remotion Player demos
├─ tooling/{eslint-config,ts-config}/
└─ .github/workflows/ci.yml
```

## Design Tokens & Theming (deliver as both package + template file)

* **Tokens**: colors (bg, fg, brand, accent, muted, success, warning, danger), typography (family, baseSize, scale, weights), spacing, radius.
* **ThemeProvider**: merges partial tokens → full tokens via context.
* **Tailwind mapping** (optional): CLI can patch `tailwind.config.js` `theme.extend`.

## Aspect Presets & Safe Areas (locked)

Provide `ASPECT_PRESETS` + `FramePreset`:

* **square** 1080×1080
* **vertical** 1080×1920 (safe area: {top:140,right:60,bottom:220,left:60})
* **web** 1920×1080
* **tall** 1080×1350
* **slide** 1080×1440
* **wide** 2560×1080
  `FramePreset` can overlay dashed safe-area boundaries when `showSafeArea` is true.

## Motion & Layout Primitives (templates + package)

Implement with typed props (`enterAt`, `duration`, `easing`, etc.), lint-clean:

* **FadeIn, FadeOut, SlideIn, SlideOut, ScaleIn, ScaleOut**
* **Stagger** (child sequencing)
* **Stack** (row/column; gap; align/justify)
* **TimelineGate** (render children after a given absolute frame)

## Composed Components (templates + package)

Typed, token-aware, className pass-through:

* **TitleCard** (title/subtitle, bg override, startAt/duration)
* **LowerThird** (primary/secondary, left/center/right align)
* **StatBlock** (value, label, delta up/down, optional icon)
* **KPIStrip** (array of StatBlock; staggered)
* **QuoteBlock** (quote, author, avatar optional)
* **ListReveal** (items\[], perItem frames; stagger)
* **ProgressBar / SeekBar** (0–1 progress; label)
* **EndCard** (CTA text, logo, button URL as prop)
* **DeviceFrame** (browser or phone chrome; slot children)

## Transitions

* **CrossFade**, **DipToColor**, **Push/Wipe** (simple masks)

## v0.1 Asset Packs (ambitious)

**Total target: 70–90 assets.**

### Icons v1 (≥20 glyphs; outline + solid; 24px grid)

* Security: shield, lock, key, eye, bug, server
* Business: chart, dollar, clock, users, briefcase
* Media: play, pause, mic, music, waveform
* System: check, xmark, info, alert, gear, cloud
  **Rules**: consistent stroke (1.5px @ 24px), `currentColor` fills/strokes, aligned to 0.5px.

### Characters v1 (mentor/analyst/engineer)

* **3 personas × 4 poses** (idle, pointing, thinking, typing) × **3 emotions** (neutral, happy, concerned) = **36 SVGs**
* Lottie micro-motions for **idle blink** per persona (3 JSON files)
* Vector discipline: separate layers for eyes/mouth/hands; token-friendly colors.

### Shapes & Overlays v1 (≥10 SVGs)

* Blobs (2), ribbons/callouts (3), grids (2), burst/rays (1), underline swash (1), badge/pill (1)

### Backgrounds v1 (≥6)

* Gradients (2), textures/noise (2), patterns (2). Prefer SVG where possible; bitmap fallbacks as WebP with sizes for 1080/1920/2560 widths.

## Asset Manifest & Loader

* **Manifest schema** (store as `packages/assets/src/manifest.ts` and copy a built manifest to `/public/assets/manifest.json` in templates):

  * `AssetKind = 'character' | 'icon' | 'shape' | 'background' | 'audio'`
  * `AssetMeta`: `{ id, kind, version, tags[], description?, license{ name:'CC0'|'CC-BY'|'MIT'|'Proprietary', url?, attribution? }, author?, ai{ prompt?, negativePrompt?, seed?, model?, upscaler?, post? }, variants[] }`
  * `Variant`: `{ id, format:'svg'|'json'|'webp'|'png'|'wav'|'mp3', width?, height?, path, themable? }`
  * `AssetManifest`: `{ pack, updatedAt, assets: AssetMeta[] }`
* **Loader** (`useAsset(assetId, variantId?, {baseUrl})`) returning `{meta, variant, url}`.
* **Preloader** for image URLs; fail safely.

## AI Asset Generation (metadata discipline)

* For AI-assist assets, include in manifest.ai: `prompt`, `negativePrompt`, `seed`, `model`, `post` (e.g., “vectorized; SVGO; normalized strokes”).
* Standard style bible: palette tokens, stroke widths, corner radii, shadow rules, icon geometry (document in `/apps/docs`).

## CLI Requirements (copy-in, shadcn-style)

Commands (examples):

```bash
npm i -D @remotion-ui/cli
npx remotion-ui init --tailwind --path src/remotion/ui
npx remotion-ui add title-card lower-third list-reveal stat-block quote-block device-frame cross-fade
npx remotion-ui add assets icons@v1 characters@v1 shapes@v1 backgrounds@v1
npx remotion-ui add-preset vertical web square
```

Behavior:

* Writes files under the specified `--path`, creates `/public/assets` and copies manifest + assets.
* Skips existing files (idempotent).
* Optional Tailwind patch: updates `tailwind.config.js` with tokens (`extend.colors`, `fontFamily`, `borderRadius`).
* Writes an installation note to wrap the Remotion root with `ThemeProvider` (no invasive code mods).

## Coding Standards

* TSConfig: `strict`, `noImplicitAny`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`.
* ESLint: no unused vars/imports, `react-hooks` rules satisfied, `jsx-a11y` for images with alt text.
* Component props: JSDoc + exported `Props` types.
* No side effects during import; components pure; no global state.
* Public API stable and documented; breaking changes gated by semver.

## Tests & CI

* **Unit**: loader utilities, variant resolution, tokens merging (vitest).
* **Visual regression**: render selected frames (Playwright or Remotion render → PNG) for: TitleCard, LowerThird, StatBlock, ListReveal, CrossFade, DeviceFrame. Set a small pixel diff threshold.
* **Lint & typecheck** in CI; build all packages; run a sample render (16:9 and 9:16).
* **SVGO** pass in CI for SVG assets; report if non-optimized.

## Docs Site (apps/docs)

* Next.js + MDX + Remotion Player demos.
* Pages:

  * **Get Started** (install CLI, add components + assets)
  * **Components** (live knobs for props)
  * **Assets Gallery** (icons, characters, shapes, backgrounds; copyable `useAsset` snippets)
  * **Aspect Presets** (safe-area overlays)
  * **Changelog** (versions for packs; do not mutate assets in place)
* Include downloadable sample project or StackBlitz.

## Sample Directory Trees to Materialize (Templates)

```
templates/
  core/primitives/{FadeIn.tsx,FadeOut.tsx,SlideIn.tsx,SlideOut.tsx,ScaleIn.tsx,ScaleOut.tsx,Stagger.tsx,Stack.tsx,TimelineGate.tsx}
  components/{TitleCard.tsx,LowerThird.tsx,StatBlock.tsx,KPIStrip.tsx,QuoteBlock.tsx,ListReveal.tsx,ProgressBar.tsx,EndCard.tsx,DeviceFrame.tsx}
  components/transitions/{CrossFade.tsx,DipToColor.tsx,Push.tsx,Wipe.tsx}
  presets/{AspectPresets.ts,FramePreset.tsx}
  themes/ThemeProvider.tsx
  examples/Root.tsx
  assets/
    manifest.json
    icons/v1/outline/*.svg
    icons/v1/solid/*.svg
    characters/v1/{mentor,analyst,engineer}/*.svg
    characters/v1/lottie/{mentor-idle.json,analyst-idle.json,engineer-idle.json}
    shapes/v1/*.svg
    backgrounds/v1/{gradients,patterns,textures}/*.(svg|webp|png)
```

## Required Component Prop Contracts (high-level)

* **All animated components**: `startAt?: number` (absolute), `durationInFrames?: number`, optional `easing`.
* **TitleCard**: `title: string; subtitle?: string; backgroundColor?: string; className?: string`
* **LowerThird**: `primary: string; secondary?: string; align?: 'left'|'center'|'right'; width?: number`
* **StatBlock**: `value: string|number; label: string; delta?: {value:number; direction:'up'|'down'}; iconId?: string`
* **KPIStrip**: `items: StatBlockProps[]; gap?: number`
* **QuoteBlock**: `quote: string; author?: string; avatarUrl?: string`
* **ListReveal**: `items: string[]; perItem?: number; gap?: number`
* **ProgressBar**: `progress: number (0..1); label?: string`
* **EndCard**: `heading: string; cta?: {label:string; href:string}; logoSrc?: string`
* **DeviceFrame**: `kind: 'browser'|'phone'; border?: boolean; children`

## Acceptance Tests (manual & automated)

1. **Fresh consumer app** (Remotion starter). Run:

   ```
   npx remotion-ui init --tailwind --path src/remotion/ui
   npx remotion-ui add title-card lower-third stat-block list-reveal cross-fade
   npx remotion-ui add assets icons@v1 characters@v1 shapes@v1 backgrounds@v1
   ```

   * Create one **web** and one **vertical** Composition using `FramePreset`.
   * Render 3 frames per component; ensure no runtime errors and expected visuals.
2. Use `useAsset('icon-shield-v1','outline-24')` and a character (`char-mentor-v1`, `idle-front`) in a demo; verify URLs resolve relative to `/assets`.
3. Lint, typecheck, tests pass in CI. Visual diffs within threshold.

## Deliverables

* Monorepo with packages, templates, and docs as above.
* Published npm package(s): `@remotion-ui/cli` (required); `@remotion-ui/{core,components,themes,assets}` (optional but recommended).
* Example renders (MP4/WebM) for docs (16:9 + 9:16).
* CHANGELOG.md noting v0.1 assets and components shipped.

## Stretch (if time allows)

* `eject` command to copy runtime package sources into consumer project.
* Beat-sync helpers (BPM → stagger timing).
* Subtitles/SRT renderer component.

---

**Primary objective**: Ship a credible **v0.1** with a real, sizeable **asset system** (≥70 items), stable **component API**, and a frictionless **copy-in CLI** so users can create professional Remotion videos immediately after running 2–3 commands.

---

## IMPORTANT: Current Implementation Status

### What's Actually Built (as of v0.2.0-beta.1)

The library has evolved beyond the initial v0.1 spec above. Here's what's currently available:

#### Core Packages
1. **@remotion-ui/core** - Motion primitives (FadeIn, SlideIn, Stack, etc.)
2. **@remotion-ui/components** - UI components (TitleCard, LowerThird, etc.)
3. **@remotion-ui/themes** - Design tokens and ThemeProvider
4. **@remotion-ui/assets** - Asset loader and manifest system
5. **@remotion-ui/cli** - Copy-in CLI tool
6. **@remotion-ui/dataviz** ✨ NEW - Data visualization components
7. **@remotion-ui/text** ✨ NEW - Text animation components

#### Key Features Delivered
- ✅ **Data Visualization** - Charts, metrics, flow diagrams (addresses feedback)
- ✅ **Text Animations** - TypeWriter, glitch effects, word stagger (addresses feedback)
- ✅ **70+ Assets** - Icons, shapes, backgrounds as originally specified
- ✅ **Professional Components** - All originally specified components
- ✅ **Transitions** - CrossFade, DipToColor, Push, Wipe
- ✅ **CLI** - Full copy-in functionality

#### What's Still Missing (for v0.3.0+)
- ❌ **Audio Package** - TTS, sync, captions (high priority)
- ❌ **Advanced Transitions** - Glitch, dissolve effects
- ❌ **Layout Templates** - Split screen, grids
- ❌ **Social Media Components** - Instagram/Tweet templates (partially done)

---

# FUTURE DEVELOPMENT ROADMAP

See [FEATURE_ROADMAP.md](./FEATURE_ROADMAP.md) for comprehensive feature suggestions based on production usage analysis.

## Priority Features for v0.2+

### High Priority
1. **@remotion-ui/dataviz** - Data visualization components (AnimatedNumber, DataCard, FlowDiagram, MetricBlock)
2. **@remotion-ui/audio** - Audio synchronization (AudioSequence, TTSProvider, CaptionSync, WaveformVisualizer)
3. **@remotion-ui/text** - Advanced text animations (TypeWriter, WordStagger, TextGlitch, TextHighlight)

### Medium Priority
4. **@remotion-ui/transitions** - Professional scene transitions (CrossDissolve, SceneWipe, GlitchTransition)
5. **@remotion-ui/layouts** - Layout templates (SplitScreen, IconTextGrid, FullScreenGraphic)
6. **Enhanced themes** - PaletteProvider, ColorExtractor, ThemeVariants

### Future Considerations
7. **Asset management** - VideoBackground, LottieLoader, IconLibrary
8. **Export utilities** - AspectRatioWrapper, SafeAreaGuide, MultiFormatExport

## Community Feedback Tracking

- Data visualization is the #1 requested feature
- Audio sync tools would save 40% development time
- Enterprise users need branded color systems
- Educational content creators need text animation presets

## Beta Launch Status

### ✅ v0.3.0-beta.1 - CURRENT VERSION (In Development)
**Audio features and TTS support!**
- Install: `npm install -D @contentfork/remotion-ui@next`
- **NEW Audio Package** (@remotion-ui/audio):
  - TTSProvider - Multi-provider TTS support (browser, Google, Azure, ElevenLabs, Polly, OpenAI)
  - AudioSequence - Timeline-based audio sequencing with crossfades
  - CaptionSync - Automated caption synchronization with SRT/VTT support
  - WaveformVisualizer - Dynamic audio waveform visualization
- All v0.2.0 features included

### Previous Releases
- **v0.2.0-beta.1**: Data visualization and text animation packages
- **v0.1.0-beta.1**: Initial beta with core components, CLI, and 70+ assets

# Important Instructions & Reminders

## Development Guidelines
- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested

## Current Status
- Beta v0.2.0-beta.1 published to npm (latest)
- Data visualization and text animation packages complete
- Core features stable and tested
- Ready for community feedback and iteration

## Next Development Cycle

### ✅ Completed in v0.2.0-beta.1
1. ✅ **Data visualization components** - 5 components built and published
   - AnimatedNumber, DataCard, FlowDiagram, MetricBlock, ComparisonCard
2. ✅ **Text animation components** - 4 components built and published
   - TypeWriter, WordStagger, TextGlitch, TextHighlight
3. ✅ Published to npm as @contentfork/remotion-ui@0.2.0-beta.1
4. ✅ All changes committed and pushed to GitHub main branch

### 🎯 Next Steps for v0.3.0

#### Immediate Actions
1. **Test the new components** in a fresh Remotion project
2. **Create demo videos** showcasing new components
3. **Update documentation** with usage examples

#### High Priority Features
1. **Audio Synchronization Package** (@remotion-ui/audio)
   - AudioSequence - Sync components to audio timeline
   - TTSProvider - Provider-agnostic TTS wrapper
   - CaptionSync - Automated caption synchronization
   - WaveformVisualizer - Audio waveform displays

2. **Enhanced Transitions** (@remotion-ui/transitions)
   - CrossDissolve - Smooth scene transitions
   - SceneWipe - Directional wipes
   - GlitchTransition - Digital glitch effects
   - SceneStinger - Logo/graphic transitions

3. **Layout Templates** (@remotion-ui/layouts)
   - SplitScreen - Side-by-side layouts
   - IconTextGrid - Grid of icons with text
   - FullScreenGraphic - Background with overlay
   - TitleSubtitleLayout - Common title patterns

#### Testing & Documentation
1. **Visual regression tests** for new components
2. **Usage examples** for each component
3. **Performance benchmarks** for data viz components
4. **TypeScript documentation** improvements

#### Community Engagement
1. **Demo video** showing all 9 new components
2. **Blog post** about data visualization in Remotion
3. **Discord announcement** in Remotion community
4. **Twitter thread** with component examples
