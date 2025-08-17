# Remotion-UI - Next Steps & Usage Guide

## 🚀 Quick Start for Users

### Installation & Usage

```bash
# Clone the repository
git clone https://github.com/rrh1441/remotion-ui.git
cd remotion-ui

# Install dependencies
pnpm install

# Build all packages
pnpm build

# In your Remotion project, install the CLI (once published to npm)
npm install -D @remotion-ui/cli

# Initialize Remotion-UI in your project
npx remotion-ui init

# Add components
npx remotion-ui add title-card lower-third stat-block

# Add icon assets
npx remotion-ui add assets icons@v1
```

### Using Components in Your Remotion Project

```tsx
import { TitleCard } from './remotion/ui/components/TitleCard';
import { ThemeProvider } from './remotion/ui/themes/ThemeProvider';

export const MyVideo = () => (
  <ThemeProvider>
    <TitleCard 
      title="Welcome to My Video"
      subtitle="Created with Remotion-UI"
    />
  </ThemeProvider>
);
```

## 📚 Documentation Site Setup (Fumadocs)

### 1. Create the Docs App

```bash
# Navigate to the monorepo root
cd /Users/ryanheger/remotion-ui

# Create the docs app using Fumadocs
pnpm create fumadocs-app apps/docs

# Choose the following options:
# - Package manager: pnpm
# - Add Tailwind CSS: Yes
# - ESLint: Yes
# - Import alias: @/*
```

### 2. Configure Fumadocs for Remotion-UI

Create `apps/docs/fumadocs.config.ts`:

```typescript
import { defineConfig } from 'fumadocs-core/config';

export default defineConfig({
  name: 'Remotion-UI',
  description: 'Beautiful motion components for Remotion',
  url: process.env.NODE_ENV === 'production' 
    ? 'https://remotion-ui.dev' 
    : 'http://localhost:3000',
});
```

### 3. Create Documentation Structure

```
apps/docs/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (landing page)
│   └── docs/
│       ├── [[...slug]]/
│       │   └── page.tsx
│       └── layout.tsx
├── content/
│   └── docs/
│       ├── meta.json
│       ├── index.mdx (Getting Started)
│       ├── installation.mdx
│       ├── components/
│       │   ├── meta.json
│       │   ├── title-card.mdx
│       │   ├── lower-third.mdx
│       │   ├── stat-block.mdx
│       │   ├── quote-block.mdx
│       │   ├── end-card.mdx
│       │   ├── device-frame.mdx
│       │   └── transitions/
│       │       ├── meta.json
│       │       ├── cross-fade.mdx
│       │       ├── push.mdx
│       │       └── wipe.mdx
│       ├── primitives/
│       │   ├── meta.json
│       │   ├── fade.mdx
│       │   ├── slide.mdx
│       │   ├── scale.mdx
│       │   ├── stack.mdx
│       │   └── stagger.mdx
│       ├── assets/
│       │   ├── meta.json
│       │   ├── overview.mdx
│       │   ├── icons.mdx
│       │   └── usage.mdx
│       ├── presets/
│       │   ├── meta.json
│       │   ├── aspect-ratios.mdx
│       │   └── safe-areas.mdx
│       ├── themes/
│       │   ├── meta.json
│       │   ├── tokens.mdx
│       │   └── customization.mdx
│       └── cli/
│           ├── meta.json
│           ├── commands.mdx
│           └── configuration.mdx
├── components/
│   ├── RemotionPlayer.tsx
│   ├── ComponentDemo.tsx
│   ├── AssetGallery.tsx
│   └── InteractivePlayground.tsx
└── package.json
```

### 4. Create Interactive Component Demos

Create `apps/docs/components/RemotionPlayer.tsx`:

```tsx
'use client';

import { Player } from '@remotion/player';
import { useCallback } from 'react';

interface RemotionPlayerProps {
  component: React.ComponentType<any>;
  inputProps?: Record<string, any>;
  durationInFrames?: number;
  fps?: number;
  compositionWidth?: number;
  compositionHeight?: number;
}

export function RemotionPlayer({
  component: Component,
  inputProps = {},
  durationInFrames = 150,
  fps = 30,
  compositionWidth = 1920,
  compositionHeight = 1080,
}: RemotionPlayerProps) {
  const renderComponent = useCallback(() => {
    return <Component {...inputProps} />;
  }, [Component, inputProps]);

  return (
    <div className="rounded-lg overflow-hidden border">
      <Player
        component={renderComponent}
        durationInFrames={durationInFrames}
        fps={fps}
        compositionWidth={compositionWidth}
        compositionHeight={compositionHeight}
        style={{
          width: '100%',
          aspectRatio: `${compositionWidth} / ${compositionHeight}`,
        }}
        controls
      />
    </div>
  );
}
```

### 5. Example Documentation Page

Create `apps/docs/content/docs/components/title-card.mdx`:

```mdx
---
title: Title Card
description: A beautiful animated title card component for video intros
---

import { RemotionPlayer } from '@/components/RemotionPlayer';
import { TitleCard } from '@remotion-ui/components';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { Callout } from 'fumadocs-ui/components/callout';

## Overview

The Title Card component creates stunning animated title sequences for your videos with customizable text, colors, and animation timing.

<RemotionPlayer 
  component={TitleCard}
  inputProps={{
    title: "Welcome to Remotion-UI",
    subtitle: "Beautiful motion components"
  }}
/>

## Installation

<Tabs items={['CLI', 'Manual']}>
  <Tab value="CLI">
    ```bash
    npx remotion-ui add title-card
    ```
  </Tab>
  <Tab value="Manual">
    Copy the component from `templates/components/TitleCard.tsx` to your project.
  </Tab>
</Tabs>

## Usage

```tsx
import { TitleCard } from '@/components/TitleCard';

export const MyComposition = () => (
  <TitleCard
    title="My Amazing Video"
    subtitle="Created with Remotion"
    startAt={0}
    durationInFrames={120}
  />
);
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Main title text |
| `subtitle` | `string` | - | Optional subtitle |
| `startAt` | `number` | `0` | Frame to start animation |
| `durationInFrames` | `number` | `60` | Total duration |
| `backgroundColor` | `string` | Theme default | Background color |
| `textColor` | `string` | Theme default | Text color |

## Examples

### With Custom Colors

<RemotionPlayer 
  component={TitleCard}
  inputProps={{
    title: "Custom Colors",
    subtitle: "Purple gradient background",
    backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    textColor: "#ffffff"
  }}
/>

### Delayed Start

<RemotionPlayer 
  component={TitleCard}
  inputProps={{
    title: "Delayed Animation",
    subtitle: "Starts at frame 30",
    startAt: 30
  }}
  durationInFrames={180}
/>

## Best Practices

<Callout type="info">
  For social media videos, keep titles concise and impactful. Aim for 3-5 words maximum.
</Callout>

<Callout type="warning">
  Ensure sufficient contrast between text and background colors for accessibility.
</Callout>
```

### 6. Deploy Documentation

```bash
# Add deployment script to apps/docs/package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "deploy": "vercel --prod"
  }
}

# Deploy to Vercel
cd apps/docs
pnpm deploy
```

## 👥 Team Collaboration Guide

### For Contributors

1. **Fork & Clone**
   ```bash
   # Fork on GitHub, then:
   git clone https://github.com/YOUR_USERNAME/remotion-ui.git
   cd remotion-ui
   pnpm install
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/component-name
   ```

3. **Development Workflow**
   ```bash
   # Start development
   pnpm dev
   
   # Run tests
   pnpm test
   
   # Check types
   pnpm typecheck
   
   # Lint code
   pnpm lint
   ```

4. **Component Development Guidelines**
   - Place new components in `templates/components/`
   - Include TypeScript types
   - Add JSDoc comments
   - Create demo in `templates/examples/Root.tsx`
   - Write documentation in `apps/docs/content/docs/components/`

5. **Submit PR**
   - Include component demo
   - Add tests if applicable
   - Update documentation
   - Follow conventional commits

### For Maintainers

1. **Release Process**
   ```bash
   # Install changesets
   pnpm add -D @changesets/cli -w
   
   # Create changeset
   pnpm changeset
   
   # Version packages
   pnpm changeset version
   
   # Publish to npm
   pnpm changeset publish
   ```

2. **Review Checklist**
   - [ ] Code follows style guide
   - [ ] TypeScript types are correct
   - [ ] Component is self-contained
   - [ ] Documentation is complete
   - [ ] Demo works correctly
   - [ ] No breaking changes (or documented)

## 🎯 Priority Tasks

### Week 1: Documentation & Polish
- [ ] Set up Fumadocs with all component pages
- [ ] Create interactive playground for each component
- [ ] Add API documentation
- [ ] Set up Algolia search
- [ ] Deploy to remotion-ui.dev

### Week 2: Asset Expansion
- [ ] Generate character SVGs (3 personas × 4 poses × 3 emotions)
- [ ] Create shape library (blobs, ribbons, grids)
- [ ] Design background patterns
- [ ] Add Lottie animations for characters
- [ ] Update manifest with all assets

### Week 3: CLI Enhancement
- [ ] Implement `add assets` command
- [ ] Add `eject` command for runtime packages
- [ ] Create `update` command for component updates
- [ ] Add interactive component selection
- [ ] Implement dependency resolution

### Week 4: Testing & CI/CD
- [ ] Set up Playwright for visual regression
- [ ] Add unit tests for all components
- [ ] Configure GitHub Actions CI
- [ ] Set up automatic npm publishing
- [ ] Add bundle size tracking

## 🏗️ Infrastructure Setup

### 1. GitHub Repository Settings

```yaml
# .github/CODEOWNERS
* @rrh1441

# .github/FUNDING.yml
github: [rrh1441]
open_collective: remotion-ui
custom: ["https://remotion-ui.dev/sponsor"]
```

### 2. Issue Templates

Create `.github/ISSUE_TEMPLATE/`:
- `bug_report.md`
- `feature_request.md`
- `component_proposal.md`

### 3. PR Template

Create `.github/pull_request_template.md`:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New component
- [ ] Documentation
- [ ] Breaking change

## Checklist
- [ ] Component is self-contained
- [ ] TypeScript types included
- [ ] Documentation updated
- [ ] Tests pass
- [ ] Demo added to examples
```

### 4. Contributing Guidelines

Create `CONTRIBUTING.md`:
```markdown
# Contributing to Remotion-UI

## Code of Conduct
Be respectful and inclusive.

## How to Contribute
1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Submit a pull request

## Component Guidelines
- Self-contained (no external dependencies)
- TypeScript with proper types
- Follow existing patterns
- Include documentation

## Commit Convention
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Tests
- chore: Maintenance
```

## 📦 NPM Publishing Setup

### 1. Package Configuration

Update all `package.json` files:
```json
{
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/rrh1441/remotion-ui.git"
  },
  "bugs": {
    "url": "https://github.com/rrh1441/remotion-ui/issues"
  },
  "homepage": "https://remotion-ui.dev"
}
```

### 2. Automated Publishing

Create `.github/workflows/release.yml`:
```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: changesets/action@v1
        with:
          publish: pnpm changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 🎨 Community & Marketing

### 1. Social Presence
- Create Twitter/X account: @remotionui
- Discord server for community support
- YouTube channel for tutorials
- Dev.to articles for launch

### 2. Launch Strategy
1. **Soft Launch**: Share with Remotion community
2. **Product Hunt**: Schedule launch
3. **Hacker News**: Show HN post
4. **Reddit**: r/reactjs, r/webdev
5. **Twitter Thread**: Component showcases

### 3. Example Projects
Create showcase repositories:
- `remotion-ui-examples`: Various use cases
- `remotion-ui-starter`: Boilerplate project
- `remotion-ui-tutorials`: Step-by-step guides

## 🔄 Maintenance Plan

### Weekly Tasks
- Review and merge PRs
- Respond to issues
- Update dependencies
- Release patches

### Monthly Tasks
- Add new components
- Expand asset library
- Update documentation
- Community showcase

### Quarterly Tasks
- Major version releases
- Performance audits
- Security updates
- Roadmap planning

## 📈 Success Metrics

Track these KPIs:
- GitHub stars
- NPM downloads
- Component usage analytics
- Documentation traffic
- Community contributions
- Discord members

## 🚦 Go-Live Checklist

Before public launch:
- [ ] All core components tested
- [ ] Documentation complete
- [ ] CLI working end-to-end
- [ ] Assets manifest validated
- [ ] NPM packages published
- [ ] Domain configured (remotion-ui.dev)
- [ ] Documentation deployed
- [ ] GitHub repository public
- [ ] Social accounts created
- [ ] Launch materials prepared

---

## Ready to Launch! 🎉

Once the above steps are complete, Remotion-UI will be ready for public release as a production-ready, open-source component library for the Remotion ecosystem.

For questions or support, contact: [your-email@example.com]