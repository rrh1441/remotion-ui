import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../packages/*/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../packages/*/src/**/*.story.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-controls',
    '@storybook/addon-docs',
    '@storybook/addon-viewport',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  features: {
    storyStoreV7: true,
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  viteFinal: async (config) => {
    // Ensure proper alias resolution for workspace packages
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@remotion-ui/core': '/Users/ryanheger/remotion-ui/packages/core/src',
        '@remotion-ui/components': '/Users/ryanheger/remotion-ui/packages/components/src',
        '@remotion-ui/themes': '/Users/ryanheger/remotion-ui/packages/themes/src',
        '@remotion-ui/assets': '/Users/ryanheger/remotion-ui/packages/assets/src',
        '@remotion-ui/dataviz': '/Users/ryanheger/remotion-ui/packages/dataviz/src',
        '@remotion-ui/text': '/Users/ryanheger/remotion-ui/packages/text/src',
        '@remotion-ui/audio': '/Users/ryanheger/remotion-ui/packages/audio/src',
      };
    }
    return config;
  },
};

export default config;