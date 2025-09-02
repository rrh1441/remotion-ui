import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '@remotion-ui/themes';

// Mock Remotion context for Storybook
const RemotionMockProvider = ({ children }: { children: React.ReactNode }) => {
  const [frame] = React.useState(30);
  
  // Mock useCurrentFrame hook
  React.useEffect(() => {
    // @ts-ignore - Mock Remotion's useCurrentFrame
    window.remotionUseCurrentFrame = () => frame;
  }, [frame]);

  return <>{children}</>;
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: {
        // Video-standard viewports
        'landscape-hd': {
          name: 'Landscape HD (1920x1080)',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
        'portrait-hd': {
          name: 'Portrait HD (1080x1920)',
          styles: {
            width: '1080px',
            height: '1920px',
          },
        },
        'square-hd': {
          name: 'Square HD (1080x1080)',
          styles: {
            width: '1080px',
            height: '1080px',
          },
        },
        'web-hd': {
          name: 'Web HD (1920x1080)',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
      defaultViewport: 'landscape-hd',
    },
  },
  decorators: [
    (Story) => (
      <RemotionMockProvider>
        <ThemeProvider>
          <div style={{ padding: '20px', minHeight: '400px' }}>
            <Story />
          </div>
        </ThemeProvider>
      </RemotionMockProvider>
    ),
  ],
};

export default preview;