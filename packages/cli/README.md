# @remotion-ui/cli

The official CLI for Remotion-UI - Beautiful, production-ready motion components for Remotion.

## What is Remotion-UI?

Remotion-UI is a copy-paste component library for [Remotion](https://www.remotion.dev/), similar to [shadcn/ui](https://ui.shadcn.com/) but for video creation. Instead of installing components as dependencies, you copy them directly into your project, giving you full ownership and control.

## Features

- 🎬 **20+ Motion Components** - Titles, transitions, charts, social media cards
- 🎨 **70+ Production Assets** - Icons, shapes, backgrounds, all optimized for video
- 📋 **Copy & Paste** - Own your code, customize everything
- 🎯 **TypeScript First** - Full type safety out of the box
- 🎪 **Zero Runtime Dependencies** - Components are yours to modify

## Installation

```bash
# In your existing Remotion project
npm install -D @remotion-ui/cli
# or
pnpm add -D @remotion-ui/cli
# or
yarn add -D @remotion-ui/cli
```

## Usage

### Initialize

Set up Remotion-UI in your project:

```bash
npx remotion-ui init
```

This creates a `src/remotion/ui` directory with the base structure.

### Add Components

Copy components into your project:

```bash
# Add specific components
npx remotion-ui add title-card fade-in

# Add multiple components
npx remotion-ui add title-card lower-third bar-chart

# Interactive selection
npx remotion-ui add
```

### Add Assets

Install asset packs:

```bash
# Add icon pack (70+ icons)
npx remotion-ui add assets icons@v1

# Add shapes and backgrounds
npx remotion-ui add assets shapes@v1 backgrounds@v1
```

### Use in Your Composition

```tsx
import { TitleCard } from './remotion/ui/components/TitleCard';
import { FadeIn } from './remotion/ui/core/primitives/FadeIn';

export const MyVideo = () => (
  <FadeIn durationInFrames={30}>
    <TitleCard 
      title="Beautiful Videos"
      subtitle="Made with Remotion-UI"
    />
  </FadeIn>
);
```

## Available Components

### Animation Primitives
- `fade-in`, `fade-out` - Opacity animations
- `slide-in`, `slide-out` - Position animations
- `scale-in`, `scale-out` - Scale animations
- `stagger` - Sequential child animations

### Title Components
- `title-card` - Full-screen titles
- `lower-third` - Name/title overlays
- `quote-block` - Quotation displays

### Data Visualization
- `line-chart` - Animated line graphs
- `bar-chart` - Dynamic bar charts
- `pie-chart` - Circular charts

### Social Media
- `instagram-post` - Instagram-style cards
- `tweet-embed` - Twitter/X post recreation

### Transitions
- `cross-fade` - Smooth opacity transition
- `dip-to-color` - Fade through color
- `push`, `wipe` - Directional transitions

## Philosophy

Like shadcn/ui, Remotion-UI gives you:

- **Ownership** - Components are in YOUR source code
- **Customization** - Modify anything to fit your needs
- **No Lock-in** - Delete what you don't use
- **Type Safety** - Full TypeScript support
- **Best Practices** - Production-ready patterns

## Documentation

Full documentation and examples: [https://github.com/rrh1441/remotion-ui](https://github.com/rrh1441/remotion-ui)

## License

MIT © Ryan Heger

---

Built with ❤️ for the Remotion community