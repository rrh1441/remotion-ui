# Remotion-UI Library Roadmap

## Overview

This roadmap prioritizes issues and enhancements for the Remotion-UI library to meet expansion requirements and achieve v1.0 quality standards. Items are labeled by complexity (S/M/L) and grouped into releases.

## v1.1.0 - Critical Infrastructure (Non-Breaking)

### 🔥 Priority 1 - Build System & Type Safety

**Issue #1: Fix TypeScript Configuration** (Size: M)
- **Problem**: Cannot compile due to JSX flags, peer deps, module resolution
- **Acceptance**: All packages compile with `tsc --noEmit` with zero errors
- **Files**: All `tsconfig.json`, peer dependencies in package.json
- **Impact**: Blocks all development work

**Issue #2: Package Manager & Build Pipeline** (Size: M) 
- **Problem**: pnpm not available, turbo build failing
- **Acceptance**: `npm run lint` and `npm run typecheck` pass in CI
- **Files**: Update scripts to be npm-compatible, fix turbo config
- **Impact**: Critical for CI/CD and development workflow

### 🎯 Priority 2 - Schema & Validation (Required by expansion.md)

**Issue #3: Add Zod Schemas for All Components** (Size: L)
- **Problem**: Zero components have zod schemas + getDefaultProps()
- **Acceptance**: Every public block has schema and defaults export
- **Components**: All 35+ components across all packages
- **Example API**:
  ```typescript
  export const TitleCardSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    startAt: z.number().default(0),
    durationInFrames: z.number().default(60),
  });
  export const getTitleCardDefaults = () => TitleCardSchema.parse({});
  ```
- **Impact**: Required for expansion.md compliance

### 📚 Priority 3 - Documentation & Testing Infrastructure

**Issue #4: Setup Storybook with Controls** (Size: L)
- **Problem**: No Storybook configuration or stories exist
- **Acceptance**: Every block has story with Controls knobs + timing demo
- **Files**: `.storybook/`, `**/*.stories.tsx` for all components
- **Features**: 
  - Controls for all props
  - "Timing Demo" story showing enter/steady/exit
  - Both 1920×1080 and 1080×1920 viewports
- **Impact**: Required for expansion.md compliance, critical for adoption

**Issue #5: Complete Visual Regression Tests** (Size: L)
- **Problem**: Only 6 components have visual tests, missing orientations
- **Acceptance**: All blocks have 3-frame tests in both orientations
- **Test Cases**: 
  - Enter frame (early animation)
  - Steady frame (mid animation) 
  - Exit frame (late animation)
  - Both 1920×1080 and 1080×1920
- **Files**: Extend `tests/visual/`, add baselines
- **Impact**: Required for expansion.md compliance

## v1.2.0 - Missing Core Primitives (Non-Breaking)

### 🧱 Missing Foundation Components

**Issue #6: Text Primitive Component** (Size: M)
- **Purpose**: Video-safe text rendering with pre-measurement
- **API**: `<Text variant="h1" size="2xl" measure={true}>`
- **Features**: Font loading, SSR safety, no layout jitter
- **Package**: @remotion-ui/core

**Issue #7: Card Primitive Component** (Size: S)
- **Purpose**: Generic card container with theme integration
- **API**: `<Card variant="elevated" padding="md">`
- **Features**: Theme-aware styling, className passthrough
- **Package**: @remotion-ui/core

**Issue #8: MediaFrame Component** (Size: M)
- **Purpose**: Media container with aspect ratio handling
- **API**: `<MediaFrame aspectRatio="16:9" fit="cover">`
- **Features**: Responsive scaling, safe area support
- **Package**: @remotion-ui/core

**Issue #9: Grid Layout Component** (Size: M)
- **Purpose**: CSS Grid wrapper for complex layouts  
- **API**: `<Grid cols={3} gap="md" responsive>`
- **Features**: Auto-responsive, theme spacing
- **Package**: @remotion-ui/core

**Issue #10: Badge/Pill Components** (Size: S)
- **Purpose**: Small status and label indicators
- **API**: `<Badge variant="success" size="sm">Active</Badge>`
- **Features**: Color variants, size options
- **Package**: @remotion-ui/core

**Issue #11: Icon Component** (Size: M)
- **Purpose**: Icon display with asset system integration
- **API**: `<Icon name="shield" variant="outline" size="md">`
- **Features**: Asset loader integration, theme colors
- **Package**: @remotion-ui/core
- **Dependencies**: @remotion-ui/assets integration

## v1.3.0 - Missing Block Components (Non-Breaking)

### 📊 Advanced Display Components

**Issue #12: KPICard Component** (Size: M)
- **Purpose**: Individual KPI display (complement to KPIStrip)
- **API**: `<KPICard value="1,234" label="Users" trend={+12.5}>`
- **Features**: Trend indicators, number formatting
- **Package**: @remotion-ui/components

**Issue #13: StepsList Component** (Size: M)
- **Purpose**: Process steps visualization with animations
- **API**: `<StepsList steps={steps} currentStep={2} timing="stagger">`
- **Features**: Step progression, custom icons
- **Package**: @remotion-ui/components

**Issue #14: Timeline Component** (Size: L)
- **Purpose**: Temporal event visualization (distinct from TimelineGate)
- **API**: `<Timeline events={events} duration={120} highlight="current">`
- **Features**: Event markers, time scaling, animations
- **Package**: @remotion-ui/components

**Issue #15: FeatureGrid Component** (Size: M) 
- **Purpose**: Feature showcase with icons and descriptions
- **API**: `<FeatureGrid features={features} columns={3} stagger>`
- **Features**: Icon integration, responsive layout
- **Package**: @remotion-ui/components

**Issue #16: ComparisonRow Component** (Size: S)
- **Purpose**: Side-by-side comparison display
- **API**: `<ComparisonRow left={itemA} right={itemB} divider>`
- **Features**: VS display, custom dividers
- **Package**: @remotion-ui/components

## v1.4.0 - Performance & Accessibility (Non-Breaking)

### ⚡ Performance Optimizations

**Issue #17: Add Component Memoization** (Size: M)
- **Problem**: Missing React.memo and useMemo in expensive components
- **Components**: DataCard, FlowDiagram, ComparisonCard, MetricBlock
- **Acceptance**: No unnecessary re-renders during animation
- **Impact**: Smooth 60fps playback for complex compositions

**Issue #18: SSR Safety Improvements** (Size: S)
- **Problem**: No window object safety checks
- **Acceptance**: All components render safely during SSR
- **Pattern**: `typeof window !== 'undefined'` guards
- **Impact**: Better Next.js/server integration

**Issue #19: Text Pre-measurement** (Size: L)
- **Problem**: Potential layout jitter from dynamic text sizing
- **Solution**: Pre-measure text dimensions, cache results
- **Components**: All text-heavy components
- **Impact**: Eliminates layout shifts during animation

### ♿ Accessibility Improvements

**Issue #20: WCAG Contrast Validation** (Size: M)
- **Problem**: No contrast validation in theme tokens
- **Solution**: Contrast checker utility, validated color pairs
- **Acceptance**: All color combinations meet WCAG AA (4.5:1)
- **Files**: Theme token validation, contrast utility function

**Issue #21: Video Target Font Sizing** (Size: S)
- **Problem**: No minimum font size enforcement for 720p/1080p
- **Solution**: Theme tokens with video-safe minimums
- **Acceptance**: All text readable at target resolutions
- **Impact**: Professional video output standards

**Issue #22: Semantic Markup & ARIA** (Size: M)
- **Problem**: Missing semantic HTML and screen reader support
- **Solution**: Proper heading hierarchy, ARIA labels, roles
- **Components**: All interactive and informational components
- **Impact**: Better accessibility compliance

## v1.5.0 - Enhanced Tooling (Non-Breaking)

### 🛠️ Developer Experience

**Issue #23: ESLint Config Package** (Size: M)
- **Purpose**: Prevent layout jitter and randomization
- **Rules**: No Math.random(), no DOM measurement during render
- **Package**: @remotion-ui/eslint-config (enhance existing)
- **Impact**: Enforces video-safe coding practices

**Issue #24: Build Hygiene Improvements** (Size: S)
- **Tree Shaking**: Verify sideEffects: false in all packages
- **Type Exports**: Add proper types exports to package.json
- **Bundle Analysis**: Report bundle sizes, unused exports
- **Impact**: Better consumer build performance

**Issue #25: Advanced Visual Testing** (Size: L)
- **Multi-resolution**: Test at 720p, 1080p, 4K targets
- **Animation Coverage**: Test key frames throughout animations
- **Cross-platform**: Validate rendering consistency
- **Tools**: Enhanced Playwright setup, diff reporting
- **Impact**: Robust visual regression detection

## Future Considerations (v2.0+)

### 🔮 Breaking Changes & Major Features

**Advanced Transitions Package** (Size: XL)
- Push, Wipe, Slide, Morph transitions 
- GPU-accelerated effects where possible
- Breaking: New transition API design

**Layout Templates System** (Size: XL)
- SplitScreen, PictureInPicture, NewscastLayout
- Responsive layout engine
- Breaking: New composition structure

**Advanced Asset Management** (Size: L)
- Video backgrounds, Lottie animations
- Asset optimization pipeline
- Version management and CDN integration

## Implementation Guidelines

### Complexity Definitions
- **S (Small)**: 1-3 days, single file changes, minimal testing
- **M (Medium)**: 1-2 weeks, multiple files, integration testing  
- **L (Large)**: 2-4 weeks, new packages/major features, comprehensive testing
- **XL (Extra Large)**: 1-2 months, breaking changes, extensive coordination

### Release Cadence
- **Monthly releases** for incremental improvements
- **Quarterly releases** for major features
- **Emergency patches** for critical bug fixes

### Success Metrics
- **Code Coverage**: >90% for all new components
- **Visual Test Coverage**: 100% of public components
- **Performance**: 60fps playback for all standard compositions  
- **Accessibility**: WCAG AA compliance for all interactive elements
- **Developer Experience**: <5 minute setup time for new projects

## Contributing

Each roadmap item should become a GitHub issue with:
- Clear acceptance criteria
- Technical specification
- Test requirements
- Breaking change assessment
- Documentation updates needed

Priority can be adjusted based on community feedback and usage analytics.