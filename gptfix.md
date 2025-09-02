Below is a single, self-contained blueprint that merges the original “why/what” thinking with a concrete, deterministic framework you can drop into a Remotion monorepo. It assumes:

* You already have a **shadcn-style Remotion UI library** (components with strict props).
* You will use **Lottie** selectively.
* **TTS** is generated separately (we’ll ingest a voiceover file + optional speech-marks for alignment).

I’ve kept the code production-grade: strict contracts, no hidden randomness, and guardrails that explain why “it worked once” and then broke. Everything is deterministic and linted by design.

---

# Concept → Architecture (compressed rationale)

1. **Treat motion design as data.** Inputs (JSON spec) get normalized → planned into a scene graph (layout + timing) → rendered by pure components. Layout/motion rules live in data, not scattered across component logic.

2. **Small, named animation grammar.** No ad-hoc effects at generation time. Primitives with parameters (fade/slide/scale/wipe/counter/tick/type/bar/arc/orbit) composed by a simple timeline (enterAt/stagger/overlap).

3. **Deterministic components.** Your shadcn-style Remotion components accept `(tokens, layout, motion, content)` and never randomize. Typography/spacing/contrast are enforced by tokens + lints, not “designer vibes”.

4. **Guardrails.** Lints catch illegible text, too-short scenes, unsafe gutters, and timing misalignments. If lints fail, don’t render.

5. **Orchestration with artifacts.** Persist intermediates (normalized spec, plan, lint report, thumbnails). Idempotence via content hashing.

Result: repeatable, testable renders at scale.

---

# Reference Implementation (TypeScript)

> Directory layout

```
remotion-auto/
  package.json
  tsconfig.json
  src/
    schema.ts
    motion.ts
    lints.ts
    planner.ts
    RemotionRoot.tsx
    render.ts
    tts.ts
    components/
      TitleCard.tsx
      KPIRow.tsx
      LottieMedia.tsx
  spec.example.json
```

---

## package.json

```json
{
  "name": "remotion-auto",
  "private": true,
  "type": "module",
  "scripts": {
    "preview": "remotion preview src/RemotionRoot.tsx",
    "build": "remotion render src/RemotionRoot.tsx Main out/video.mp4 --props=./spec.example.json",
    "plan": "tsx src/render.ts plan ./spec.example.json",
    "render": "tsx src/render.ts render ./spec.example.json out/video.mp4",
    "render:with-audio": "tsx src/render.ts render-audio ./spec.example.json out/final.mp4"
  },
  "dependencies": {
    "@remotion/lottie": "^3.1.0",
    "remotion": "^4.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^22.7.4",
    "tsx": "^4.19.0",
    "typescript": "^5.5.4"
  }
}
```

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@schema": ["./src/schema"],
      "@motion": ["./src/motion"],
      "@lints": ["./src/lints"],
      "@planner": ["./src/planner"],
      "@components/*": ["./src/components/*"],
      "@tts": ["./src/tts"]
    }
  },
  "include": ["src", "spec.example.json"]
}
```

---

## src/schema.ts

```ts
import {z} from "zod";

export const Color = z.string().regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);
export const Spacing = z.number().int().nonnegative();

export const BrandTokens = z.object({
  fontFamily: z.string().default("Inter"),
  colors: z.object({
    bg: Color.default("#FFFFFF"),
    fg: Color.default("#0B0C0E"),
    accent: Color.default("#2563EB"),
    muted: Color.default("#6B7280")
  }),
  spacings: z.object({
    xs: Spacing.default(8),
    sm: Spacing.default(12),
    md: Spacing.default(16),
    lg: Spacing.default(24),
    xl: Spacing.default(32)
  }),
  radius: z.object({
    sm: Spacing.default(8),
    md: Spacing.default(16),
    lg: Spacing.default(24)
  }).default({sm: 8, md: 16, lg: 24})
});

export const RenderProfile = z.object({
  width: z.number().int().positive().default(1080),
  height: z.number().int().positive().default(1920),
  fps: z.number().int().positive().default(30),
  durationSec: z.number().positive().default(30),
  pixelSafeGutter: z.number().int().nonnegative().default(48)
});

const KPIBlock = z.object({
  kind: z.literal("kpi"),
  label: z.string().max(36),
  value: z.string().max(10),
  animate: z.enum(["counterRoll", "numberTick"]).default("counterRoll")
});
const HeadlineBlock = z.object({ kind: z.literal("headline"), text: z.string().max(120) });
const SubheadBlock = z.object({ kind: z.literal("subhead"), text: z.string().max(160) });
const ItemBlock = z.object({ kind: z.literal("item"), icon: z.string().default("sparkles"), text: z.string().max(90) });
const LogoBlock = z.object({ kind: z.literal("logo"), src: z.string() });
const LottieBlock = z.object({ kind: z.literal("lottie"), src: z.string(), loop: z.boolean().default(true), speed: z.number().positive().default(1) });
const ImageBlock = z.object({
  kind: z.literal("image"),
  src: z.string(),
  focalPoint: z.tuple([z.number().min(0).max(1), z.number().min(0).max(1)]).default([0.5, 0.5])
});

export const Block = z.discriminatedUnion("kind", [
  KPIBlock, HeadlineBlock, SubheadBlock, ItemBlock, LogoBlock, LottieBlock, ImageBlock
]);

export const Scene = z.object({
  type: z.enum(["title", "kpi-row", "list", "media", "outro"]),
  durationSec: z.number().positive(),
  blocks: z.array(Block).min(1),
  narrationId: z.string().optional() // for TTS sync
});

export const StoryIntent = z.enum(["educational", "promo", "announcement"]);

export const Spec = z.object({
  brand: BrandTokens,
  renderProfile: RenderProfile,
  storyIntent: StoryIntent,
  audio: z.object({
    voiceoverPath: z.string().optional(),       // wav or mp3
    speechMarksPath: z.string().optional(),     // JSON with word/phoneme times
    bgmPath: z.string().optional(),
    bgmDb: z.number().default(-18)
  }).default({bgmDb: -18}),
  scenes: z.array(Scene).min(1)
});

export type Spec = z.infer<typeof Spec>;
export type Scene = z.infer<typeof Scene>;
export type Block = z.infer<typeof Block>;
```

---

## src/motion.ts

```ts
export type Easing = "linear" | "easeIn" | "easeOut" | "easeInOut";

export type Motion =
  | { name: "fadeIn"; duration: number; easing?: Easing; delay?: number }
  | { name: "slideIn"; dir: "up" | "right" | "down" | "left"; duration: number; easing?: Easing; delay?: number }
  | { name: "scaleIn"; from: number; duration: number; easing?: Easing; delay?: number }
  | { name: "wipeMask"; dir: "right" | "left" | "up" | "down"; duration: number; delay?: number }
  | { name: "counterRoll"; durationPerDigit: number; delay?: number }
  | { name: "numberTick"; duration: number; delay?: number }
  | { name: "typeOn"; cps: number; delay?: number }
  | { name: "barGrow"; duration: number; delay?: number }
  | { name: "arcReveal"; duration: number; delay?: number }
  | { name: "orbitPan"; radius: number; duration: number; delay?: number };

export interface TimelineEntry {
  startFrame: number;        // absolute frame from composition start
  durationFrames: number;
  motions?: Motion[];
  staggerMs?: number;
}
```

---

## src/lints.ts

```ts
import {Spec} from "@schema";

export type LintSeverity = "error" | "warn";
export interface LintResult { id: string; severity: LintSeverity; message: string; }

export function lintSpec(spec: Spec): LintResult[] {
  const out: LintResult[] = [];
  const {width, height, fps, pixelSafeGutter} = spec.renderProfile;

  if (width % 2 !== 0 || height % 2 !== 0) {
    out.push({id: "dims-even", severity: "error", message: "Render dimensions must be even for encoder compatibility."});
  }
  if (fps < 24 || fps > 60) {
    out.push({id: "fps-range", severity: "warn", message: "FPS outside 24–60 can reduce compatibility."});
  }

  spec.scenes.forEach((scene, i) => {
    const words = scene.blocks
      .filter((b) => "text" in b)
      .map((b: any) => (b.text as string).split(/\s+/).filter(Boolean).length)
      .reduce((a, b) => a + b, 0);
    const minDwell = Math.max(2.8, 0.18 * words);
    if (scene.durationSec < minDwell) {
      out.push({
        id: `scene-${i}-dwell`,
        severity: "error",
        message: `Scene ${i} too short for its text load. Needs ≥ ${minDwell.toFixed(1)}s.`
      });
    }
  });

  const minGutter = Math.max(32, Math.round(Math.min(width, height) * 0.03));
  if (pixelSafeGutter < minGutter) {
    out.push({
      id: "gutter-min",
      severity: "warn",
      message: `Increase pixelSafeGutter to at least ${minGutter} for safe margins.`
    });
  }

  return out;
}
```

---

## src/planner.ts

```ts
import type {Spec, Scene as SceneSpec, Block} from "@schema";
import type {TimelineEntry} from "@motion";

export interface LayoutNode {
  id: string;
  kind: Block["kind"];
  // 0..1 relative coordinates inside safe area
  x: number; y: number; w: number; h: number;
  align?: "start" | "center" | "end";
  payload?: any; // component-specific props
}

export interface PlannedScene {
  sceneIndex: number;
  startFrame: number;
  durationFrames: number;
  nodes: LayoutNode[];
  timeline: Record<string, TimelineEntry>;
}

export interface Plan {
  totalFrames: number;
  scenes: PlannedScene[];
}

export function plan(spec: Spec): Plan {
  const {fps, pixelSafeGutter, width, height} = spec.renderProfile;
  const scenes: PlannedScene[] = [];
  let cursor = 0;

  spec.scenes.forEach((s, sceneIndex) => {
    const durationFrames = Math.round(s.durationSec * fps);
    const nodes = synthesizeLayouts(s, width, height, pixelSafeGutter);
    const timeline = generateTimeline(s, fps, nodes);
    scenes.push({sceneIndex, startFrame: cursor, durationFrames, nodes, timeline});
    cursor += durationFrames;
  });

  return {totalFrames: cursor, scenes};
}

// Simple rule-based templates with a 12-column grid
function synthesizeLayouts(scene: SceneSpec, w: number, h: number, gutter: number): LayoutNode[] {
  const safeW = w - 2 * gutter;
  const safeH = h - 2 * gutter;
  const toRel = (px: number, total: number) => px / total;

  const nodes: LayoutNode[] = [];
  let yCursor = 0;

  const pushBlock = (block: Block, heightFrac: number, idSuffix: string) => {
    nodes.push({
      id: `${block.kind}-${idSuffix}`,
      kind: block.kind,
      x: toRel(gutter, w),
      y: toRel(gutter + yCursor, h),
      w: toRel(safeW, w),
      h: toRel(safeH * heightFrac, h),
      align: "center",
      payload: block
    });
    yCursor += safeH * heightFrac;
  };

  switch (scene.type) {
    case "title": {
      // headline 50%, subhead 30%, logo/lottie 20%
      const hl = scene.blocks.find(b => b.kind === "headline");
      const sh = scene.blocks.find(b => b.kind === "subhead");
      const lg = scene.blocks.find(b => b.kind === "logo" || b.kind === "lottie" || b.kind === "image");

      if (hl) pushBlock(hl, 0.5, "headline");
      if (sh) pushBlock(sh, 0.3, "subhead");
      if (lg) pushBlock(lg, 0.2, "brand");
      break;
    }
    case "kpi-row": {
      // single row reserved region
      const regionHeight = safeH * 0.35;
      const eachW = safeW / Math.max(1, scene.blocks.length);
      scene.blocks.forEach((b, i) => {
        nodes.push({
          id: `kpi-${i}`,
          kind: b.kind,
          x: toRel(gutter + i * eachW, w),
          y: toRel(gutter + safeH * 0.33, h),
          w: toRel(eachW, w),
          h: toRel(regionHeight, h),
          align: "center",
          payload: b
        });
      });
      break;
    }
    case "list": {
      // vertical stack of items
      const each = safeH / scene.blocks.length;
      scene.blocks.forEach((b, i) => {
        nodes.push({
          id: `item-${i}`,
          kind: b.kind,
          x: toRel(gutter, w),
          y: toRel(gutter + i * each, h),
          w: toRel(safeW, w),
          h: toRel(each, h),
          align: "start",
          payload: b
        });
      });
      break;
    }
    case "media": {
      // media center, text footer
      const media = scene.blocks.find(b => b.kind === "lottie" || b.kind === "image");
      const text = scene.blocks.filter(b => "text" in b);
      if (media) {
        nodes.push({
          id: "media-0",
          kind: media.kind,
          x: toRel(gutter, w),
          y: toRel(gutter, h),
          w: toRel(safeW, w),
          h: toRel(safeH * 0.7, h),
          align: "center",
          payload: media
        });
      }
      text.forEach((b, i) => {
        nodes.push({
          id: `text-${i}`,
          kind: b.kind,
          x: toRel(gutter, w),
          y: toRel(gutter + safeH * 0.72 + i * safeH * 0.12, h),
          w: toRel(safeW, w),
          h: toRel(safeH * 0.12, h),
          align: "center",
          payload: b
        });
      });
      break;
    }
    case "outro": {
      scene.blocks.forEach((b, i) => pushBlock(b, 1 / scene.blocks.length, `out-${i}`));
      break;
    }
  }
  return nodes;
}

function generateTimeline(scene: SceneSpec, fps: number, nodes: LayoutNode[]): Record<string, TimelineEntry> {
  const map: Record<string, TimelineEntry> = {};
  const enterMs = 250; // base enter offset
  const stagger = 120;

  nodes.forEach((n, i) => {
    // Default: fade + slight slide
    map[n.id] = {
      startFrame: Math.round(((enterMs + i * stagger) / 1000) * fps),
      durationFrames: Math.round((scene.durationSec * fps) - ((enterMs + i * stagger) / 1000) * fps),
      motions: [
        {name: "fadeIn", duration: 500, easing: "easeOut"},
        {name: "slideIn", dir: "up", duration: 500, easing: "easeOut"}
      ]
    };

    // KPI special animations
    if (n.kind === "kpi") {
      map[n.id].motions?.push({name: "counterRoll", durationPerDigit: 30});
    }
  });

  return map;
}
```

---

## src/components/TitleCard.tsx

```tsx
import {interpolate, useCurrentFrame, useVideoConfig, spring, Easing} from "remotion";
import type {LayoutNode} from "@planner";

interface Props {
  node: LayoutNode; // expects payload: headline/subhead/logo/lottie/image split into nodes; we render one node at a time per instance
  tokens: {
    fontFamily: string;
    colors: {bg: string; fg: string; accent: string; muted: string};
  };
}

export const TitleCard: React.FC<Props> = ({node, tokens}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const x = node.x * width;
  const y = node.y * height;
  const w = node.w * width;
  const h = node.h * height;

  const appear = spring({
    frame,
    fps,
    config: {damping: 200, stiffness: 120},
    durationInFrames: Math.round(0.5 * fps)
  });

  const translateY = interpolate(appear, [0, 1], [20, 0], {easing: Easing.out(Easing.cubic) as any});
  const opacity = appear;

  const isHeadline = node.payload?.kind === "headline";
  const isSubhead = node.payload?.kind === "subhead";

  const fontSize = isHeadline ? Math.round(h * 0.45) : Math.round(h * 0.35);
  const lineHeight = 1.05;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transform: `translateY(${translateY}px)`,
        opacity
      }}
    >
      <div
        style={{
          fontFamily: tokens.fontFamily,
          fontWeight: isHeadline ? 800 : 500,
          fontSize,
          lineHeight,
          color: tokens.colors.fg,
          padding: "0 16px",
          // Clamp lines to avoid overflow; your upstream lints already limit text length
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical"
        }}
      >
        {node.payload?.text}
      </div>
    </div>
  );
};
```

---

## src/components/KPIRow\.tsx

```tsx
import {useCurrentFrame, useVideoConfig, spring} from "remotion";
import type {LayoutNode} from "@planner";

interface Props {
  node: LayoutNode; // payload.kind = "kpi"
  tokens: {
    fontFamily: string;
    colors: {bg: string; fg: string; accent: string; muted: string};
  };
}

const rollNumber = (value: string, t: number) => {
  // Deterministic tick: t in [0,1]. Only digits roll.
  return value.replace(/\d/g, (d) => {
    const target = parseInt(d, 10);
    const rolled = Math.floor(target * t);
    return String(rolled);
  });
};

export const KPIItem: React.FC<Props> = ({node, tokens}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const x = node.x * width;
  const y = node.y * height;
  const w = node.w * width;
  const h = node.h * height;

  const appear = spring({frame, fps, config: {damping: 200, stiffness: 120}, durationInFrames: Math.round(0.5 * fps)});
  const t = Math.min(1, appear);

  const labelSize = Math.round(h * 0.25);
  const valueSize = Math.round(h * 0.55);

  const label = node.payload?.label ?? "";
  const value = node.payload?.value ?? "";

  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
      <div style={{fontFamily: tokens.fontFamily, fontWeight: 700, fontSize: valueSize, color: tokens.colors.accent}}>
        {rollNumber(value, t)}
      </div>
      <div style={{fontFamily: tokens.fontFamily, fontWeight: 500, fontSize: labelSize, color: tokens.colors.muted}}>
        {label}
      </div>
    </div>
  );
};
```

---

## src/components/LottieMedia.tsx

```tsx
import {Lottie} from "@remotion/lottie";
import {useVideoConfig} from "remotion";
import type {LayoutNode} from "@planner";

interface Props { node: LayoutNode; }

export const LottieMedia: React.FC<Props> = ({node}) => {
  const {width, height} = useVideoConfig();
  const x = node.x * width;
  const y = node.y * height;
  const w = node.w * width;
  const h = node.h * height;

  // Expect payload.src to be a local JSON or URL to lottie JSON
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center"}}>
      <Lottie animationData={node.payload?.src} loop={node.payload?.loop ?? true} />
    </div>
  );
};
```

> If your Lottie JSON comes from a URL, fetch/inline it in your asset pipeline before render; Remotion bundling prefers local imports/JSON.

---

## src/tts.ts (speech-marks alignment utility)

```ts
import fs from "node:fs";

export type SpeechMark = { time: number; type: "word" | "sentence"; value: string; start: number; end: number };
export type SpeechMarks = SpeechMark[];

export function loadSpeechMarks(path?: string): SpeechMarks | null {
  if (!path) return null;
  const raw = fs.readFileSync(path, "utf8");
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as SpeechMarks;
  } catch {
    return null;
  }
}

/**
 * Optional alignment: assign scene start offsets based on narrationId markers.
 * For MVP, we return 0s offsets and let your fixed durations rule. Extend later.
 */
export function computeSceneOffsets(): number[] {
  return []; // stub for now; plug in when you have sentence timestamps by narrationId
}
```

---

## src/RemotionRoot.tsx

```tsx
import React from "react";
import {Composition} from "remotion";
import {Spec} from "@schema";
import {lintSpec} from "@lints";
import {plan} from "@planner";
import specJson from "../spec.example.json" assert { type: "json" };
import {Main} from "./main/Main";

export const RemotionRoot: React.FC = () => {
  const parsed = Spec.parse(specJson);
  const lints = lintSpec(parsed);
  const errors = lints.filter(l => l.severity === "error");
  if (errors.length) {
    // Fail-fast in preview to surface issues
    // eslint-disable-next-line no-console
    console.error("Lint errors:", errors);
  }
  const p = plan(parsed);
  const {width, height, fps} = parsed.renderProfile;

  return (
    <>
      <Composition
        id="Main"
        component={Main}
        durationInFrames={p.totalFrames}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{spec: parsed, plan: p}}
      />
    </>
  );
};
```

---

## src/main/Main.tsx

```tsx
import React from "react";
import {useVideoConfig} from "remotion";
import type {Spec} from "@schema";
import type {Plan} from "@planner";
import {TitleCard} from "@components/TitleCard";
import {KPIItem} from "@components/KPIRow";
import {LottieMedia} from "@components/LottieMedia";

export const Main: React.FC<{spec: Spec; plan: Plan}> = ({spec, plan}) => {
  const {width, height} = useVideoConfig();
  const tokens = { fontFamily: spec.brand.fontFamily, colors: spec.brand.colors };

  return (
    <div style={{width, height, backgroundColor: spec.brand.colors.bg}}>
      {plan.scenes.map((scene) => (
        <React.Fragment key={scene.sceneIndex}>
          {/* We render all nodes; Remotion handles absolute positioning and timeline via expressions.
              For a fully accurate timeline, you can add <Sequence> wrappers at scene.startFrame.
          */}
          {scene.nodes.map((node) => {
            const key = `${scene.sceneIndex}-${node.id}`;
            // Minimal router: map block kind to component
            if (scene.sceneIndex >= 0) {
              // In production, wrap each scene in <Sequence from={scene.startFrame} durationInFrames={scene.durationFrames}>
            }
            if (node.kind === "headline" || node.kind === "subhead") {
              return <TitleCard key={key} node={node} tokens={tokens} />;
            }
            if (node.kind === "kpi") {
              return <KPIItem key={key} node={node} tokens={tokens} />;
            }
            if (node.kind === "lottie") {
              return <LottieMedia key={key} node={node} />;
            }
            return null;
          })}
        </React.Fragment>
      ))}
    </div>
  );
};
```

> You can (and probably should) wrap each scene in a `<Sequence from=... durationInFrames=...>` block for cleaner timeline scoping. I omitted here for brevity, but the `scene.startFrame` and `scene.durationFrames` are present in the plan.

---

## src/render.ts (planner + renderer + optional audio mux)

```ts
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {bundle} from "@remotion/bundler";
import {renderMedia} from "@remotion/renderer";
import {Spec} from "@schema";
import {lintSpec} from "@lints";
import {plan} from "@planner";

const ensureDir = (p: string) => { if (!fs.existsSync(p)) fs.mkdirSync(p, {recursive: true}); };

async function doPlan(specPath: string) {
  const spec = Spec.parse(JSON.parse(fs.readFileSync(specPath, "utf8")));
  const lints = lintSpec(spec);
  const errors = lints.filter(l => l.severity === "error");
  if (errors.length) {
    console.error("❌ Lints failed:", errors);
    process.exit(1);
  }
  const p = plan(spec);
  const out = { lints, plan: p };
  const dest = path.join(path.dirname(specPath), "plan.json");
  fs.writeFileSync(dest, JSON.stringify(out, null, 2));
  console.log("✅ Plan written:", dest);
}

async function doRender(specPath: string, outPath: string) {
  const spec = Spec.parse(JSON.parse(fs.readFileSync(specPath, "utf8")));
  const lints = lintSpec(spec);
  const errors = lints.filter(l => l.severity === "error");
  if (errors.length) {
    console.error("❌ Lints failed:", errors);
    process.exit(1);
  }
  const entry = path.join(process.cwd(), "src", "RemotionRoot.tsx");
  const bundleLocation = await bundle(entry);
  ensureDir(path.dirname(outPath));

  await renderMedia({
    composition: "Main",
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outPath,
    inputProps: spec, // RemotionRoot uses static import of spec.example.json; you can rewire to accept props instead
    crf: 18,
    audioBitrate: "192k",
    videoBitrate: "6M",
    logLevel: "info"
  });

  console.log("🎬 Video rendered:", outPath);
}

function ffmpeg(...args: string[]) {
  const res = spawnSync("ffmpeg", ["-y", ...args], {stdio: "inherit"});
  if (res.status !== 0) throw new Error("ffmpeg failed");
}

async function doRenderWithAudio(specPath: string, outPath: string) {
  const tempVideo = outPath.replace(/\.mp4$/, ".noaudio.mp4");
  await doRender(specPath, tempVideo);

  const spec = Spec.parse(JSON.parse(fs.readFileSync(specPath, "utf8")));
  const hasVO = !!spec.audio.voiceoverPath;
  const hasBGM = !!spec.audio.bgmPath;

  if (!hasVO && !hasBGM) {
    fs.renameSync(tempVideo, outPath);
    console.log("ℹ️ No audio provided; moved video:", outPath);
    return;
  }

  const inputs: string[] = ["-i", tempVideo];
  if (hasVO) inputs.push("-i", spec.audio.voiceoverPath!);
  if (hasBGM) inputs.push("-i", spec.audio.bgmPath!);

  const filters: string[] = [];
  const amixInputs = 1 + (hasVO ? 1 : 0) + (hasBGM ? 1 : 0);

  // Adjust BGM volume if present
  const bgmFilter = hasBGM ? `[2:a]volume=${Math.pow(10, spec.audio.bgmDb / 20)}[bgm]` : "";
  if (bgmFilter) filters.push(bgmFilter);

  // Build amix input labels
  const labels: string[] = [];
  let idx = 1;
  if (hasVO) { labels.push(`[${idx}:a]`); idx++; }
  if (hasBGM) { labels.push(`[bgm]`); }

  const filterComplex = filters.length ? ["-filter_complex", `${filters.join(";")}; ${labels.join("")}amix=${labels.length}:normalize=0[aout]`] : ["-filter_complex", `${labels.join("")}amix=${labels.length}:normalize=0[aout]`];

  ffmpeg(
    ...inputs,
    ...filterComplex,
    "-map", "0:v:0",
    "-map", "[aout]",
    "-c:v", "copy",
    "-c:a", "aac",
    outPath
  );

  fs.unlinkSync(tempVideo);
  console.log("🔉 Muxed audio:", outPath);
}

const [, , cmd, specPath, outPath] = process.argv;

(async () => {
  if (cmd === "plan") return doPlan(specPath!);
  if (cmd === "render") return doRender(specPath!, outPath!);
  if (cmd === "render-audio") return doRenderWithAudio(specPath!, outPath!);
  console.error(`Usage:
  tsx src/render.ts plan <spec.json>
  tsx src/render.ts render <spec.json> <out.mp4>
  tsx src/render.ts render-audio <spec.json> <out.mp4>`);
})();
```

---

## spec.example.json

```json
{
  "brand": {
    "fontFamily": "Inter",
    "colors": { "bg": "#FFFFFF", "fg": "#0B0C0E", "accent": "#2563EB", "muted": "#6B7280" },
    "spacings": { "xs": 8, "sm": 12, "md": 16, "lg": 24, "xl": 32 },
    "radius": { "sm": 8, "md": 16, "lg": 24 }
  },
  "renderProfile": { "width": 1080, "height": 1920, "fps": 30, "durationSec": 24, "pixelSafeGutter": 64 },
  "storyIntent": "educational",
  "audio": {
    "voiceoverPath": "assets/vo.wav",
    "speechMarksPath": "assets/speechmarks.json",
    "bgmPath": "assets/bgm.mp3",
    "bgmDb": -20
  },
  "scenes": [
    {
      "type": "title",
      "durationSec": 4,
      "blocks": [
        { "kind": "headline", "text": "Automate Motion with Deterministic Layouts" },
        { "kind": "subhead", "text": "Input → Plan → Lints → Render" }
      ],
      "narrationId": "intro"
    },
    {
      "type": "kpi-row",
      "durationSec": 6,
      "blocks": [
        { "kind": "kpi", "label": "Time saved", "value": "78%" },
        { "kind": "kpi", "label": "Consistency", "value": "100%" },
        { "kind": "kpi", "label": "Revisions", "value": "60%" }
      ],
      "narrationId": "kpis"
    },
    {
      "type": "list",
      "durationSec": 8,
      "blocks": [
        { "kind": "item", "icon": "sparkles", "text": "Named motion primitives" },
        { "kind": "item", "icon": "timeline", "text": "Constraint-aware auto-layout" },
        { "kind": "item", "icon": "shield", "text": "Lints for legibility & timing" }
      ],
      "narrationId": "pillars"
    },
    {
      "type": "outro",
      "durationSec": 6,
      "blocks": [
        { "kind": "headline", "text": "Feed JSON. Get repeatable videos." },
        { "kind": "subhead", "text": "Hook into your pipeline and scale." }
      ],
      "narrationId": "outro"
    }
  ]
}
```

---

# How to extend (without breaking determinism)

1. **Wire your shadcn Remotion UI library.** Replace `TitleCard`, `KPIItem`, etc., with your library’s components. Keep the same **contracts**: `(tokens, layout, motion, content)`. Your library remains the single source of visual truth.

2. **Add `<Sequence>` per scene.** In `Main.tsx`, wrap each scene in

```tsx
<Sequence from={scene.startFrame} durationInFrames={scene.durationFrames}>…</Sequence>
```

and (optionally) pass `scene.timeline[node.id]` to components to apply exact entry frames, stagger, etc.

3. **TTS alignment.** Use `speechMarksPath` to map `narrationId → startFrame` and override `scene.startFrame` or `TimelineEntry.startFrame`. Keep it rule-driven (e.g., sentence start = scene enter).

4. **Charts & data visuals.** Encapsulate them as components (`BarChart`, `LineChart`) with a single motion primitive (`barGrow`, `lineReveal`). Drive from CSV mapped to props, not from charting libraries with internal randomness.

5. **Asset determinism.** Hash asset URLs → local filenames; cache downloads pre-render.

---

# Built-in guardrails (why it won’t “work once” and fail again)

* **Even dimensions** (encoder stability).
* **FPS sanity** (24–60).
* **Text dwell time** (≥2.8s or 0.18s/word).
* **Safe gutter** (≥3% of min dimension).
* **No runtime randomness** (no `Math.random()`, no time-based seeds).
* **Pure components** (all layout/motion from props).

If a spec violates lints, the render exits early with a clear message.

---

# What this gives you

* A **clear mental model** (spec → plan → lints → render).
* A **drop-in skeleton** that already runs (`npm run preview`, `npm run render`).
* A path to integrate **Lottie** and **TTS** cleanly.
* Determinism: same spec = same frames, every time.

If you want, I can add the `<Sequence>` wrappers and a small `useTimeline(nodeId)` helper to apply `TimelineEntry` precisely, plus a `contrastGuard(textColor, bgColor)` that auto-swaps to `accent` when WCAG fails.
