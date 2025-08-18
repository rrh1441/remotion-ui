# Remotion-UI

**A source-first component, asset, and preset system for Remotion** - Think "shadcn for motion"

## 🚀 Project Status: Beta Release

> **Beta Notice:** This is v0.1.0-beta.1 of Remotion-UI. The API is stable and production-ready, but we're gathering feedback before the official v0.1.0 release. Please report any issues or suggestions!

### ✅ Ready for Use
- **Feature-complete CLI** with automatic dependency resolution
- **25+ motion components** ready to copy into your project
- **70+ production assets** including icons, shapes, and backgrounds
- **Visual regression testing** ensuring component stability
- **Comprehensive documentation** with quick-start guide

## 📦 What's Been Built

### Packages
- **@remotion-ui/core** - Motion and layout primitives (FadeIn, SlideIn, Stack, Stagger, etc.)
- **@remotion-ui/themes** - Design tokens, ThemeProvider, and aspect ratio presets
- **@remotion-ui/components** - Composed components (TitleCard, LowerThird, StatBlock, etc.)
- **@remotion-ui/cli** - Copy-in CLI tool for adding components to your project

### Architecture
- Monorepo with pnpm workspaces
- TypeScript with strict mode
- ESLint configuration
- Turbo build system

## 🎯 Vision

Remotion-UI aims to provide:
1. **Copy-in components** - No runtime dependencies, own your code
2. **70+ production-ready assets** - Icons, characters, shapes, backgrounds
3. **Aspect ratio presets** - With safe areas for social media
4. **Professional components** - TitleCards, LowerThirds, transitions, and more
5. **shadcn-style DX** - Simple CLI, great defaults, fully customizable

## 🚀 Quick Start

```bash
# Install the CLI (beta)
npm install -D @contentfork/remotion-ui@beta

# Initialize in your Remotion project
npx remotion-ui init --path src/remotion/ui

# Add components
npx remotion-ui add title-card lower-third stat-block

# Add assets
npx remotion-ui add assets icons@v1 shapes@v1 backgrounds@v1
```

## 🛠️ Development Setup

```bash
# Clone the repository
git clone https://github.com/rrh1441/remotion-ui.git
cd remotion-ui

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run in development mode
pnpm dev
```

## 📁 Project Structure

```
remotion-ui/
├── packages/
│   ├── core/          # Motion/layout primitives
│   ├── components/    # Composed components  
│   ├── themes/        # Design tokens & presets
│   ├── assets/        # Asset loader & manifest (pending)
│   └── cli/           # Copy-in CLI tool
├── templates/         # Source files for CLI copying (pending)
├── apps/
│   └── docs/          # Documentation site (pending)
└── tooling/          # Shared configs
```

## 📊 Beta Feedback

We're looking for feedback on:
- **Component API** - Are the props intuitive?
- **Asset quality** - Do the assets meet your needs?
- **CLI experience** - Is the installation process smooth?
- **Documentation** - What's missing or unclear?

Please [open an issue](https://github.com/rrh1441/remotion-ui/issues) with your feedback!

## 🚀 Future Roadmap

See [FEATURE_ROADMAP.md](./FEATURE_ROADMAP.md) for planned features including:
- **Data Visualization** - Charts, metrics, flow diagrams
- **Audio Sync** - TTS integration, captions, waveforms
- **Advanced Text** - TypeWriter, word stagger, glitch effects
- **Pro Transitions** - Dissolves, wipes, stingers
- And much more based on production usage analysis!

## 📄 License

MIT

## 🤝 Contributing

This project is currently in initial development. Check back soon for contribution guidelines.

---

**Note:** This is an implementation of the specification in [CLAUDE.md](./CLAUDE.md). The project follows the "shadcn for Remotion" philosophy - providing high-quality, copy-in components for video creation.