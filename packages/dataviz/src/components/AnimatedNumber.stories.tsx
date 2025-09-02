import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedNumber, AnimatedNumberSchema, getAnimatedNumberDefaults } from './AnimatedNumber';

const meta: Meta<typeof AnimatedNumber> = {
  title: 'Data Visualization/AnimatedNumber',
  component: AnimatedNumber,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Animated number component with formatting options for currency, percentages, and compact notation.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 1000000, step: 1 },
      description: 'Target value to animate to',
    },
    format: {
      control: 'select',
      options: ['number', 'currency', 'percent', 'compact'],
      description: 'Number format type',
    },
    duration: {
      control: { type: 'number', min: 1, max: 120, step: 1 },
      description: 'Animation duration in frames',
    },
    decimals: {
      control: { type: 'number', min: 0, max: 5, step: 1 },
      description: 'Number of decimal places',
    },
    prefix: {
      control: 'text',
      description: 'Text to show before the number',
    },
    suffix: {
      control: 'text',
      description: 'Text to show after the number',
    },
    startAt: {
      control: { type: 'number', min: 0, max: 300, step: 1 },
      description: 'Frame to start animation',
    },
    locale: {
      control: 'text',
      description: 'Locale for number formatting',
    },
    currency: {
      control: 'text',
      description: 'Currency code (for currency format)',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AnimatedNumber>;

// Default story with schema defaults
export const Default: Story = {
  args: getAnimatedNumberDefaults(),
};

export const Currency: Story = {
  args: {
    ...getAnimatedNumberDefaults(),
    value: 1234.56,
    format: 'currency',
    decimals: 2,
    currency: 'USD',
  },
};

export const Percentage: Story = {
  args: {
    ...getAnimatedNumberDefaults(),
    value: 85,
    format: 'percent',
    decimals: 1,
  },
};

export const Compact: Story = {
  args: {
    ...getAnimatedNumberDefaults(),
    value: 1234567,
    format: 'compact',
    decimals: 1,
  },
};

export const WithPrefixSuffix: Story = {
  args: {
    ...getAnimatedNumberDefaults(),
    value: 42,
    prefix: 'Level ',
    suffix: '/100',
    decimals: 0,
  },
};

export const LongAnimation: Story = {
  args: {
    ...getAnimatedNumberDefaults(),
    value: 10000,
    duration: 90,
    format: 'compact',
    decimals: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'Extended animation duration showing smooth number progression',
      },
    },
  },
};

// Timing demonstration story
export const TimingDemo: Story = {
  args: {
    ...getAnimatedNumberDefaults(),
    value: 1000,
    duration: 60,
    format: 'number',
    decimals: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates animation timing: starts at frame 0, completes at frame 60',
      },
    },
  },
};

// Schema validation story
export const SchemaValidation: Story = {
  args: AnimatedNumberSchema.parse({
    value: 999,
    format: 'currency',
    duration: 45,
    decimals: 2,
    currency: 'EUR',
    locale: 'de-DE',
  }),
  parameters: {
    docs: {
      description: {
        story: 'All props validated using AnimatedNumberSchema with German locale and EUR currency',
      },
    },
  },
};

// Large numbers
export const LargeNumbers: Story = {
  args: {
    ...getAnimatedNumberDefaults(),
    value: 1500000000,
    format: 'compact',
    decimals: 1,
    duration: 75,
  },
};