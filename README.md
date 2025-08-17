# Remotion-UI

**A source-first component, asset, and preset system for Remotion** - Think "shadcn for motion"

## 🚀 Project Status

This is a work-in-progress implementation of Remotion-UI v0.1. The core architecture and foundation packages have been built. See [NEXTSTEPS.md](./NEXTSTEPS.md) for remaining work.

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

## 🛠️ Development Setup

```bash
# Clone the repository
git clone <repo-url>
cd remotion-ui

# Install dependencies
pnpm install

# Build all packages
pnpm build

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

## 🚧 What's Next

See [NEXTSTEPS.md](./NEXTSTEPS.md) for detailed remaining work:
- Template files for CLI copying
- 70+ asset generation
- Missing components (QuoteBlock, EndCard, DeviceFrame)
- Documentation site with demos
- Testing infrastructure
- NPM publishing setup

## 📄 License

MIT

## 🤝 Contributing

This project is currently in initial development. Check back soon for contribution guidelines.

---

**Note:** This is an implementation of the specification in [CLAUDE.md](./CLAUDE.md). The project follows the "shadcn for Remotion" philosophy - providing high-quality, copy-in components for video creation.