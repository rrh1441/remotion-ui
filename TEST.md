# 🧪 Remotion-UI Testing Guide

Welcome to Remotion-UI! This guide will walk you through testing all the features as a new user.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- Basic familiarity with React and TypeScript

## 🚀 Quick Start (5 minutes)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/rrh1441/remotion-ui.git
cd remotion-ui

# Install dependencies (using pnpm)
npm install -g pnpm
pnpm install

# Build all packages
pnpm build
```

### 2. Start the Documentation Site

```bash
# Start the docs site
pnpm --filter @remotion-ui/docs dev

# Open in browser
# Visit http://localhost:3000
```

You should see:
- ✅ Landing page with "Remotion-UI" title
- ✅ Quick install commands
- ✅ Feature cards (20+ Components, 70+ Assets, Copy & Paste)

### 3. Navigate Documentation

Click "Get Started" or visit `/docs`:
- ✅ Sidebar navigation
- ✅ Documentation sections
- ✅ Component categories

## 🎨 Testing Components (15 minutes)

### A. Motion Primitives

Test the basic animation components in `templates/core/primitives/`:

```tsx
// Test FadeIn.tsx
import { FadeIn } from './templates/core/primitives/FadeIn';

// In a Remotion composition:
<FadeIn durationInFrames={30}>
  <h1>This fades in!</h1>
</FadeIn>
```

✅ **Expected**: Element fades from opacity 0 to 1 over 30 frames

### B. Title Components

Test title and text components:

```tsx
// Test TitleCard.tsx
import { TitleCard } from './templates/components/TitleCard';

<TitleCard 
  title="Welcome Video"
  subtitle="Made with Remotion-UI"
  backgroundColor="#1e40af"
/>
```

✅ **Expected**: Animated title card with fade-in effect

### C. Data Visualization

Test the new chart components:

```tsx
// Test LineChart.tsx
import { LineChart } from './templates/components/LineChart';

<LineChart 
  data={[
    { x: 0, y: 10, label: 'Jan' },
    { x: 1, y: 25, label: 'Feb' },
    { x: 2, y: 15, label: 'Mar' },
  ]}
  strokeColor="#3b82f6"
  showGrid
  showDots
/>
```

✅ **Expected**: Animated line chart with grid and data points

```tsx
// Test BarChart.tsx
import { BarChart } from './templates/components/BarChart';

<BarChart
  data={[
    { label: 'Q1', value: 45, color: '#3b82f6' },
    { label: 'Q2', value: 72, color: '#8b5cf6' },
    { label: 'Q3', value: 63, color: '#ec4899' },
  ]}
  animationType="grow"
/>
```

✅ **Expected**: Bars grow from bottom with staggered animation

### D. Social Media Components

```tsx
// Test InstagramPost.tsx
import { InstagramPost } from './templates/components/InstagramPost';

<InstagramPost
  username="remotion_ui"
  image="/path/to/image.jpg"
  likes={1234}
  caption="Check out this amazing video!"
  verified={true}
/>
```

✅ **Expected**: Instagram-style post with slide-in animation

### E. Character System

```tsx
// Test Character.tsx
import { Character } from './templates/components/Character';

<Character
  persona="tech"
  pose="pointing"
  emotion="happy"
  position={{ x: 100, y: 100 }}
  animateIn
/>
```

✅ **Expected**: Animated character with specified pose and emotion

### F. Loading & Effects

```tsx
// Test LoadingSpinner.tsx
import { LoadingSpinner } from './templates/components/LoadingSpinner';

<LoadingSpinner 
  variant="dots"
  color="#3b82f6"
  size={48}
/>
```

✅ **Expected**: Animated loading spinner with bouncing dots

## 📦 Testing Assets (10 minutes)

### 1. Icons

Check the icon collection in `templates/assets/icons/v1/`:

```bash
# List all icons
ls templates/assets/icons/v1/outline/
ls templates/assets/icons/v1/solid/
```

✅ **Expected**: 
- 27 outline SVG icons
- 27 solid SVG icons
- Icons include: shield, lock, chart, users, play, check, alert, etc.

### 2. Shapes & Decorations

Check decorative elements:

```bash
ls templates/assets/shapes/v1/
```

✅ **Expected**: 13 SVG shapes including blobs, ribbons, grids, burst, badge

### 3. Backgrounds

Check background assets:

```bash
ls templates/assets/backgrounds/v1/
```

✅ **Expected**: 6 backgrounds (gradients, textures, patterns)

### 4. Asset Manifest

Verify the manifest:

```bash
cat templates/assets/manifest.json | jq '.assets | length'
# Should output: 73
```

## 🔊 Testing Audio System (5 minutes)

Check the audio structure:

```bash
# View audio manifest
cat templates/assets/audio/v1/audio-manifest.json

# Test AudioPlayer component
```

```tsx
import { AudioPlayer } from './templates/components/AudioPlayer';

<AudioPlayer
  src="/assets/audio/v1/sfx/whoosh-01.mp3"
  volume={0.8}
  fadeInDuration={10}
  fadeOutDuration={10}
/>
```

✅ **Expected**: Audio plays with fade in/out effects

## 🎯 Testing Aspect Presets (5 minutes)

Test different aspect ratios:

```tsx
import { ASPECT_PRESETS } from './templates/presets/AspectPresets';
import { FramePreset } from './templates/presets/FramePreset';

// Test vertical (9:16) preset
<FramePreset
  preset="vertical"
  showSafeArea={true}
>
  <YourContent />
</FramePreset>
```

✅ **Expected**: 
- Correct dimensions (1080×1920)
- Dashed safe area boundaries visible
- Content properly contained

## 🧩 Integration Test (10 minutes)

Create a complete test composition combining multiple components:

```tsx
// TestComposition.tsx
import { Composition, Sequence } from 'remotion';
import { TitleCard } from './templates/components/TitleCard';
import { BarChart } from './templates/components/BarChart';
import { Character } from './templates/components/Character';
import { LoadingSpinner } from './templates/components/LoadingSpinner';
import { CrossFade } from './templates/components/transitions/CrossFade';

export const TestVideo = () => {
  return (
    <>
      {/* Scene 1: Title */}
      <Sequence from={0} durationInFrames={90}>
        <TitleCard 
          title="Remotion-UI Test"
          subtitle="All Systems Go!"
        />
      </Sequence>

      {/* Scene 2: Data Viz */}
      <Sequence from={90} durationInFrames={120}>
        <BarChart
          data={[
            { label: 'Test 1', value: 85 },
            { label: 'Test 2', value: 92 },
            { label: 'Test 3', value: 78 },
          ]}
        />
      </Sequence>

      {/* Scene 3: Character */}
      <Sequence from={210} durationInFrames={90}>
        <Character
          persona="tech"
          pose="presenting"
          emotion="excited"
          position={{ x: 400, y: 300 }}
        />
      </Sequence>
    </>
  );
};
```

## ✅ Verification Checklist

### Core Functionality
- [ ] Repository clones successfully
- [ ] Dependencies install without errors
- [ ] All packages build (`pnpm build`)
- [ ] Documentation site runs (`pnpm --filter @remotion-ui/docs dev`)

### Components (Test at least 3 from each category)
- [ ] **Primitives**: FadeIn, SlideIn, ScaleIn work
- [ ] **Titles**: TitleCard, LowerThird animate properly
- [ ] **Data Viz**: Charts render with animations
- [ ] **Social**: Instagram/Tweet components display correctly
- [ ] **Characters**: Different poses and emotions work
- [ ] **Effects**: LoadingSpinner and ParticleEffect animate

### Assets
- [ ] 73 total assets present in manifest
- [ ] Icons load correctly (test 5 random icons)
- [ ] Shapes render properly
- [ ] Backgrounds display

### Documentation
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Code examples are visible
- [ ] No console errors

### Build & Deploy
- [ ] Production build succeeds: `pnpm build`
- [ ] No TypeScript errors
- [ ] No lint warnings

## 🐛 Troubleshooting

### Common Issues & Solutions

1. **Port already in use**
   ```bash
   # Try a different port
   pnpm --filter @remotion-ui/docs dev --port 3003
   ```

2. **Module not found errors**
   ```bash
   # Rebuild packages
   pnpm build
   ```

3. **SVG assets not loading**
   - Ensure assets are copied to public directory
   - Check paths in manifest.json

4. **Component not animating**
   - Check you're in a Remotion composition
   - Verify frame count and fps settings

## 📊 Performance Benchmarks

Expected performance metrics:

- **Build time**: < 30 seconds
- **Docs site load**: < 2 seconds
- **Component render**: < 16ms per frame (60fps)
- **Asset loading**: < 100ms per asset

## 🎉 Success Criteria

You've successfully tested Remotion-UI if:

1. ✅ All components render without errors
2. ✅ Animations play smoothly
3. ✅ Assets load correctly
4. ✅ Documentation site is accessible
5. ✅ You can create a custom composition using multiple components
6. ✅ Build process completes without errors

## 📝 Feedback

If you encounter any issues:

1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure you're using Node.js 18+
4. Create an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - System information

## 🚀 Next Steps

Once testing is complete, try:

1. Creating your own custom component
2. Adding new assets to the library
3. Building a complete video project
4. Contributing improvements back to the project

---

**Testing Time Estimate**: ~45 minutes for complete walkthrough

**Quick Test** (5 min): Just run steps in "Quick Start" section

**Full Test** (45 min): Complete all sections including integration test

Happy testing! 🎬✨