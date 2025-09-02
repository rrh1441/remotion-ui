import type { Meta, StoryObj } from '@storybook/react';
import { TitleCard, TitleCardSchema, getTitleCardDefaults } from './TitleCard';

const meta: Meta<typeof TitleCard> = {
  title: 'Components/TitleCard',
  component: TitleCard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A centered title card with optional subtitle, animated entrance effects.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Main title text',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle text',
    },
    backgroundColor: {
      control: 'color',
      description: 'Background color override',
    },
    startAt: {
      control: { type: 'number', min: 0, max: 300, step: 1 },
      description: 'Frame to start animation',
    },
    durationInFrames: {
      control: { type: 'number', min: 1, max: 300, step: 1 },
      description: 'Animation duration in frames',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TitleCard>;

// Default story with schema defaults
export const Default: Story = {
  args: getTitleCardDefaults(),
};

export const WithSubtitle: Story = {
  args: {
    ...getTitleCardDefaults(),
    title: 'Welcome to Remotion UI',
    subtitle: 'Beautiful components for video creation',
  },
};

export const CustomBackground: Story = {
  args: {
    ...getTitleCardDefaults(),
    title: 'Custom Background',
    subtitle: 'With brand colors',
    backgroundColor: '#6366f1',
  },
};

export const LongAnimation: Story = {
  args: {
    ...getTitleCardDefaults(),
    title: 'Extended Animation',
    subtitle: 'Takes longer to complete',
    durationInFrames: 120,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the title card with extended animation duration',
      },
    },
  },
};

// Timing demonstration story
export const TimingDemo: Story = {
  args: {
    ...getTitleCardDefaults(),
    title: 'Timing Demo',
    subtitle: 'Shows enter, steady, and exit phases',
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the three phases of animation: enter (0-36), steady (36-60), exit (60+)',
      },
    },
  },
};

// Schema validation story
export const SchemaValidation: Story = {
  args: TitleCardSchema.parse({
    title: 'Schema Validated',
    subtitle: 'All props validated by Zod schema',
    startAt: 0,
    durationInFrames: 60,
  }),
  parameters: {
    docs: {
      description: {
        story: 'All props are validated using the TitleCardSchema Zod schema',
      },
    },
  },
};