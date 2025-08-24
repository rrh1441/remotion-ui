#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../../');
const packagesDir = path.join(rootDir, 'packages');
const templatesDir = path.join(__dirname, '../templates');

// Component registry with dependencies
const COMPONENT_REGISTRY = {
  // Core primitives (no dependencies)
  'fade-in': {
    source: 'core/src/primitives/FadeIn.tsx',
    target: 'core/primitives/FadeIn.tsx',
    dependencies: []
  },
  'fade-out': {
    source: 'core/src/primitives/FadeOut.tsx',
    target: 'core/primitives/FadeOut.tsx',
    dependencies: []
  },
  'slide-in': {
    source: 'core/src/primitives/SlideIn.tsx',
    target: 'core/primitives/SlideIn.tsx',
    dependencies: []
  },
  'slide-out': {
    source: 'core/src/primitives/SlideOut.tsx',
    target: 'core/primitives/SlideOut.tsx',
    dependencies: []
  },
  'scale-in': {
    source: 'core/src/primitives/ScaleIn.tsx',
    target: 'core/primitives/ScaleIn.tsx',
    dependencies: []
  },
  'scale-out': {
    source: 'core/src/primitives/ScaleOut.tsx',
    target: 'core/primitives/ScaleOut.tsx',
    dependencies: []
  },
  'stack': {
    source: 'core/src/primitives/Stack.tsx',
    target: 'core/primitives/Stack.tsx',
    dependencies: []
  },
  'stagger': {
    source: 'core/src/primitives/Stagger.tsx',
    target: 'core/primitives/Stagger.tsx',
    dependencies: []
  },
  'timeline-gate': {
    source: 'core/src/primitives/TimelineGate.tsx',
    target: 'core/primitives/TimelineGate.tsx',
    dependencies: []
  },
  
  // Components with dependencies
  'title-card': {
    source: 'components/src/TitleCard.tsx',
    target: 'components/TitleCard.tsx',
    dependencies: ['fade-in']
  },
  'lower-third': {
    source: 'components/src/LowerThird.tsx',
    target: 'components/LowerThird.tsx',
    dependencies: ['slide-in']
  },
  'stat-block': {
    source: 'components/src/StatBlock.tsx',
    target: 'components/StatBlock.tsx',
    dependencies: ['scale-in']
  },
  'kpi-strip': {
    source: 'components/src/KPIStrip.tsx',
    target: 'components/KPIStrip.tsx',
    dependencies: ['stat-block', 'stagger', 'stack']
  },
  'quote-block': {
    source: 'components/src/QuoteBlock.tsx',
    target: 'components/QuoteBlock.tsx',
    dependencies: ['fade-in']
  },
  'list-reveal': {
    source: 'components/src/ListReveal.tsx',
    target: 'components/ListReveal.tsx',
    dependencies: ['stagger', 'fade-in']
  },
  'progress-bar': {
    source: 'components/src/ProgressBar.tsx',
    target: 'components/ProgressBar.tsx',
    dependencies: []
  },
  'end-card': {
    source: 'components/src/EndCard.tsx',
    target: 'components/EndCard.tsx',
    dependencies: ['fade-in', 'scale-in']
  },
  'device-frame': {
    source: 'components/src/DeviceFrame.tsx',
    target: 'components/DeviceFrame.tsx',
    dependencies: []
  },
  
  // Transitions
  'cross-fade': {
    source: 'components/src/transitions/CrossFade.tsx',
    target: 'components/transitions/CrossFade.tsx',
    dependencies: []
  },
  'dip-to-color': {
    source: 'components/src/transitions/DipToColor.tsx',
    target: 'components/transitions/DipToColor.tsx',
    dependencies: []
  },
  'push': {
    source: 'components/src/transitions/Push.tsx',
    target: 'components/transitions/Push.tsx',
    dependencies: []
  },
  'wipe': {
    source: 'components/src/transitions/Wipe.tsx',
    target: 'components/transitions/Wipe.tsx',
    dependencies: []
  },
  
  // New components from templates
  'line-chart': {
    source: 'templates/components/LineChart.tsx',
    target: 'components/LineChart.tsx',
    dependencies: []
  },
  'bar-chart': {
    source: 'templates/components/BarChart.tsx',
    target: 'components/BarChart.tsx',
    dependencies: []
  },
  'pie-chart': {
    source: 'templates/components/PieChart.tsx',
    target: 'components/PieChart.tsx',
    dependencies: []
  },
  'instagram-post': {
    source: 'templates/components/InstagramPost.tsx',
    target: 'components/InstagramPost.tsx',
    dependencies: []
  },
  'tweet-embed': {
    source: 'templates/components/TweetEmbed.tsx',
    target: 'components/TweetEmbed.tsx',
    dependencies: []
  },
  'character': {
    source: 'templates/components/Character.tsx',
    target: 'components/Character.tsx',
    dependencies: []
  },
  'loading-spinner': {
    source: 'templates/components/LoadingSpinner.tsx',
    target: 'components/LoadingSpinner.tsx',
    dependencies: []
  },
  'particle-effect': {
    source: 'templates/components/ParticleEffect.tsx',
    target: 'components/ParticleEffect.tsx',
    dependencies: []
  },
  'audio-player': {
    source: 'templates/components/AudioPlayer.tsx',
    target: 'components/AudioPlayer.tsx',
    dependencies: []
  },
  
  // Data visualization components
  'animated-number': {
    source: 'dataviz/src/components/AnimatedNumber.tsx',
    target: 'components/dataviz/AnimatedNumber.tsx',
    dependencies: []
  },
  'data-card': {
    source: 'dataviz/src/components/DataCard.tsx',
    target: 'components/dataviz/DataCard.tsx',
    dependencies: ['animated-number']
  },
  'flow-diagram': {
    source: 'dataviz/src/components/FlowDiagram.tsx',
    target: 'components/dataviz/FlowDiagram.tsx',
    dependencies: []
  },
  'comparison-card': {
    source: 'dataviz/src/components/ComparisonCard.tsx',
    target: 'components/dataviz/ComparisonCard.tsx',
    dependencies: []
  },
  'metric-block': {
    source: 'dataviz/src/components/MetricBlock.tsx',
    target: 'components/dataviz/MetricBlock.tsx',
    dependencies: ['animated-number']
  },
  
  // Text animation components
  'type-writer': {
    source: 'text/src/components/TypeWriter.tsx',
    target: 'components/text/TypeWriter.tsx',
    dependencies: []
  },
  'word-stagger': {
    source: 'text/src/components/WordStagger.tsx',
    target: 'components/text/WordStagger.tsx',
    dependencies: []
  },
  'text-glitch': {
    source: 'text/src/components/TextGlitch.tsx',
    target: 'components/text/TextGlitch.tsx',
    dependencies: []
  },
  'text-highlight': {
    source: 'text/src/components/TextHighlight.tsx',
    target: 'components/text/TextHighlight.tsx',
    dependencies: []
  },
  
  // Audio components
  'tts-provider': {
    source: 'audio/src/components/TTSProvider.tsx',
    target: 'components/audio/TTSProvider.tsx',
    dependencies: []
  },
  'audio-sequence': {
    source: 'audio/src/components/AudioSequence.tsx',
    target: 'components/audio/AudioSequence.tsx',
    dependencies: []
  },
  'caption-sync': {
    source: 'audio/src/components/CaptionSync.tsx',
    target: 'components/audio/CaptionSync.tsx',
    dependencies: []
  },
  'waveform-visualizer': {
    source: 'audio/src/components/WaveformVisualizer.tsx',
    target: 'components/audio/WaveformVisualizer.tsx',
    dependencies: []
  }
};

// Transform imports from package format to relative format
function transformImports(content, targetPath) {
  // Replace @remotion-ui/core imports with relative paths
  content = content.replace(
    /@remotion-ui\/core\/primitives\/([\w]+)/g,
    (match, component) => {
      const relativePath = path.relative(
        path.dirname(targetPath),
        path.join('core/primitives', component)
      );
      return `./${relativePath}`.replace(/\\/g, '/');
    }
  );
  
  // Replace @remotion-ui/themes imports
  content = content.replace(
    /@remotion-ui\/themes/g,
    () => {
      const relativePath = path.relative(
        path.dirname(targetPath),
        'themes/ThemeProvider'
      );
      return `./${relativePath}`.replace(/\\/g, '/');
    }
  );
  
  // Replace @remotion-ui/assets imports
  content = content.replace(
    /@remotion-ui\/assets/g,
    () => {
      const relativePath = path.relative(
        path.dirname(targetPath),
        'assets/useAsset'
      );
      return `./${relativePath}`.replace(/\\/g, '/');
    }
  );
  
  return content;
}

async function buildTemplates() {
  console.log('🔨 Building templates from packages...\n');
  
  // Clean templates directory
  await fs.emptyDir(templatesDir);
  
  // Process each component
  for (const [name, config] of Object.entries(COMPONENT_REGISTRY)) {
    const sourcePath = path.join(
      config.source.startsWith('templates/') ? rootDir : packagesDir,
      config.source
    );
    const targetPath = path.join(templatesDir, config.target);
    
    if (!await fs.pathExists(sourcePath)) {
      console.warn(`⚠️  Source not found: ${config.source}`);
      continue;
    }
    
    // Read source file
    let content = await fs.readFile(sourcePath, 'utf-8');
    
    // Transform imports
    content = transformImports(content, config.target);
    
    // Ensure target directory exists
    await fs.ensureDir(path.dirname(targetPath));
    
    // Write transformed file
    await fs.writeFile(targetPath, content);
    console.log(`✅ ${name} → ${config.target}`);
  }
  
  // Copy themes
  console.log('\n📦 Copying themes...');
  const themesSource = path.join(packagesDir, 'themes/src');
  const themesTarget = path.join(templatesDir, 'themes');
  await fs.ensureDir(themesTarget);
  
  if (await fs.pathExists(themesSource)) {
    const themeFiles = await glob('**/*.{ts,tsx}', { cwd: themesSource });
    for (const file of themeFiles) {
      const content = await fs.readFile(path.join(themesSource, file), 'utf-8');
      const transformed = transformImports(content, path.join('themes', file));
      await fs.writeFile(path.join(themesTarget, file), transformed);
      console.log(`✅ themes/${file}`);
    }
  }
  
  // Copy presets
  console.log('\n📦 Copying presets...');
  const presetsSource = path.join(rootDir, 'templates/presets');
  const presetsTarget = path.join(templatesDir, 'presets');
  await fs.copy(presetsSource, presetsTarget);
  console.log('✅ Presets copied');
  
  // Copy examples
  console.log('\n📦 Copying examples...');
  const examplesSource = path.join(rootDir, 'templates/examples');
  const examplesTarget = path.join(templatesDir, 'examples');
  if (await fs.pathExists(examplesSource)) {
    await fs.copy(examplesSource, examplesTarget);
    console.log('✅ Examples copied');
  }
  
  // Copy assets
  console.log('\n📦 Copying assets...');
  const assetsSource = path.join(rootDir, 'templates/assets');
  const assetsTarget = path.join(templatesDir, 'assets');
  await fs.copy(assetsSource, assetsTarget);
  console.log('✅ Assets copied');
  
  // Write registry.json
  console.log('\n📝 Writing registry.json...');
  const registry = {};
  for (const [name, config] of Object.entries(COMPONENT_REGISTRY)) {
    registry[name] = {
      name,
      dependencies: config.dependencies,
      files: [config.target]
    };
  }
  await fs.writeJson(
    path.join(templatesDir, 'registry.json'),
    registry,
    { spaces: 2 }
  );
  console.log('✅ Registry created');
  
  console.log('\n✨ Templates built successfully!');
}

buildTemplates().catch(console.error);