# 🧪 Remotion-UI Testing Guide

Test Remotion-UI by installing components into your existing Remotion project, just like shadcn/ui.

## 📋 Prerequisites

- An existing Remotion project (v4.0+)
- Node.js 18+
- TypeScript configured

## 🚀 Testing in Your Remotion Project (5 minutes)

### 1. Install the CLI in Your Project

```bash
# In your existing Remotion project
cd my-remotion-project

# Install the Remotion-UI CLI as a dev dependency
npm install -D @remotion-ui/cli

# Or using pnpm/yarn
pnpm add -D @remotion-ui/cli
yarn add -D @remotion-ui/cli
```

### 2. Initialize Remotion-UI

```bash
# Set up Remotion-UI in your project
npx remotion-ui init

# This will:
# - Create a remotion/ui directory
# - Set up theme tokens
# - Configure TypeScript paths
# - Add base primitives
```

✅ **Verify**: Check that `src/remotion/ui/` directory was created

### 3. Add Your First Components

```bash
# Add title and animation components
npx remotion-ui add title-card fade-in slide-in

# Add data visualization components
npx remotion-ui add line-chart bar-chart

# Add social media components
npx remotion-ui add instagram-post tweet-embed
```

✅ **Verify**: Components appear in `src/remotion/ui/components/`

### 4. Add Asset Packs

```bash
# Add icon pack (70+ icons)
npx remotion-ui add assets icons@v1

# Add shapes and backgrounds
npx remotion-ui add assets shapes@v1 backgrounds@v1
```

✅ **Verify**: Assets copied to `public/assets/` with manifest.json

## 🎬 Testing Components in Your Composition

### A. Create a Test Composition

Create `src/TestRemotionUI.tsx`:

```tsx
import { Composition } from 'remotion';
import { TitleCard } from './remotion/ui/components/TitleCard';
import { FadeIn } from './remotion/ui/core/primitives/FadeIn';
import { LineChart } from './remotion/ui/components/LineChart';

export const RemotionUITest = () => {
  return (
    <>
      <FadeIn durationInFrames={30}>
        <TitleCard 
          title="Testing Remotion-UI"
          subtitle="It works!"
        />
      </FadeIn>
    </>
  );
};

// Register the composition
export const RemotionUIComposition = () => (
  <Composition
    id="remotion-ui-test"
    component={RemotionUITest}
    durationInFrames={150}
    fps={30}
    width={1920}
    height={1080}
  />
);
```

### B. Test Different Components

#### 1. Title Components
```tsx
import { TitleCard } from './remotion/ui/components/TitleCard';
import { LowerThird } from './remotion/ui/components/LowerThird';

<TitleCard 
  title="Welcome"
  subtitle="Made with Remotion-UI"
  backgroundColor="#1e40af"
/>

<LowerThird
  primary="John Doe"
  secondary="Software Engineer"
  align="left"
/>
```

✅ **Expected**: Smooth fade-in animations with proper styling

#### 2. Data Visualization
```tsx
import { BarChart } from './remotion/ui/components/BarChart';

<BarChart
  data={[
    { label: 'Q1', value: 45 },
    { label: 'Q2', value: 72 },
    { label: 'Q3', value: 63 },
    { label: 'Q4', value: 89 },
  ]}
  animationType="grow"
/>
```

✅ **Expected**: Animated bars growing from bottom

#### 3. Social Media
```tsx
import { InstagramPost } from './remotion/ui/components/InstagramPost';

<InstagramPost
  username="myproject"
  image="/my-image.jpg"
  likes={1234}
  caption="Check this out!"
  verified={true}
/>
```

✅ **Expected**: Instagram-style card with animations

#### 4. Character System
```tsx
import { Character } from './remotion/ui/components/Character';

<Character
  persona="tech"
  pose="pointing"
  emotion="happy"
/>
```

✅ **Expected**: Animated character with expressions

### C. Test Assets

```tsx
import { useAsset } from './remotion/ui/assets/useAsset';

const MyComponent = () => {
  const { url } = useAsset('icon-shield-v1', 'outline-24');
  
  return <img src={url} alt="Shield" />;
};
```

✅ **Expected**: Icon loads from `/public/assets/`

## 🔧 CLI Commands to Test

### Adding Components

```bash
# Test individual component additions
npx remotion-ui add fade-in
npx remotion-ui add title-card
npx remotion-ui add bar-chart

# Test multiple components
npx remotion-ui add fade-in slide-in scale-in

# List available components
npx remotion-ui list components
```

### Adding Assets

```bash
# Add specific asset packs
npx remotion-ui add assets icons@v1
npx remotion-ui add assets shapes@v1

# List available assets
npx remotion-ui list assets
```

### Adding Presets

```bash
# Add aspect ratio presets
npx remotion-ui add-preset vertical   # 9:16
npx remotion-ui add-preset square     # 1:1
npx remotion-ui add-preset web        # 16:9
```

## ✅ Verification Checklist

### CLI Installation
- [ ] CLI installs without errors
- [ ] `npx remotion-ui --help` shows commands
- [ ] `init` command creates directory structure

### Component Installation
- [ ] Components copy to correct directory
- [ ] TypeScript imports work
- [ ] No missing dependencies
- [ ] Components render in Remotion

### Asset Installation
- [ ] Assets copy to `/public/assets/`
- [ ] Manifest.json is valid
- [ ] Assets load in browser
- [ ] `useAsset` hook works

### In Your Remotion Project
- [ ] Components animate properly
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Renders at target FPS

## 🎯 Quick Smoke Test (2 minutes)

```bash
# In your Remotion project, run these commands:
npx remotion-ui init
npx remotion-ui add title-card fade-in
npx remotion-ui add assets icons@v1

# Then create a simple test:
```

```tsx
// src/QuickTest.tsx
import { FadeIn } from './remotion/ui/core/primitives/FadeIn';
import { TitleCard } from './remotion/ui/components/TitleCard';

export const QuickTest = () => (
  <FadeIn>
    <TitleCard title="It works!" />
  </FadeIn>
);
```

If this renders, the basic system is working!

## 🐛 Common Issues & Solutions

### "Module not found" after adding component
```bash
# Component may have dependencies on primitives
npx remotion-ui add fade-in slide-in stagger
```

### Assets not loading
```bash
# Ensure assets are in public directory
ls public/assets/
# Should show: manifest.json, icons/, shapes/, etc.
```

### TypeScript path errors
```json
// Add to tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/remotion/ui/*": ["./src/remotion/ui/*"]
    }
  }
}
```

### Component not animating
- Ensure you're within a Remotion `Composition`
- Check `durationInFrames` prop
- Verify `fps` settings match

## 📊 What to Expect

### File Structure After Installation
```
your-remotion-project/
├── src/
│   └── remotion/
│       └── ui/
│           ├── components/      # Your selected components
│           ├── core/
│           │   └── primitives/  # Animation primitives
│           ├── themes/          # Theme provider
│           └── assets/          # Asset utilities
├── public/
│   └── assets/                  # Icons, shapes, etc.
│       ├── manifest.json
│       ├── icons/v1/
│       ├── shapes/v1/
│       └── backgrounds/v1/
└── package.json                 # @remotion-ui/cli in devDependencies
```

### Performance Expectations
- Component copy: < 1 second per component
- Asset installation: < 5 seconds for full pack
- No runtime overhead (it's just copied code)
- Same performance as hand-written components

## 🚀 Advanced Testing

### Custom Theme
```tsx
// Test theme customization
import { ThemeProvider } from './remotion/ui/themes/ThemeProvider';

<ThemeProvider 
  theme={{
    colors: {
      primary: '#ff0000',
      secondary: '#00ff00',
    }
  }}
>
  <YourComponents />
</ThemeProvider>
```

### Combining Multiple Components
```tsx
import { Sequence } from 'remotion';
import { TitleCard } from './remotion/ui/components/TitleCard';
import { BarChart } from './remotion/ui/components/BarChart';
import { CrossFade } from './remotion/ui/components/transitions/CrossFade';

export const AdvancedTest = () => (
  <>
    <Sequence from={0} durationInFrames={90}>
      <TitleCard title="Data Report" />
    </Sequence>
    
    <Sequence from={60} durationInFrames={120}>
      <CrossFade durationInFrames={30}>
        <BarChart data={yourData} />
      </CrossFade>
    </Sequence>
  </>
);
```

## 🎉 Success Criteria

You've successfully integrated Remotion-UI if:

1. ✅ CLI installs and runs in your project
2. ✅ Components copy to your project correctly
3. ✅ Components render without import errors
4. ✅ Animations play smoothly
5. ✅ You can customize components locally
6. ✅ Assets load from public directory

## 💡 The Key Difference from Libraries

Remember: **You own the code!**

- ✅ No `node_modules` dependency
- ✅ Components are in YOUR source code
- ✅ Fully customizable after copying
- ✅ No version conflicts
- ✅ No bundle size from external deps
- ✅ Can delete components you don't use

## 📝 Feedback

If the CLI doesn't work as expected:

1. Check you have Node.js 18+
2. Ensure you're in a Remotion project
3. Report issues with:
   - Your Remotion version
   - Error message
   - Command that failed

---

**Quick Test**: 2 minutes (just init + one component)

**Full Test**: 15 minutes (multiple components + assets)

This is YOUR code now - customize it however you want! 🎨