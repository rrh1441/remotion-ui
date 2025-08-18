import Link from 'next/link';

const components = [
  // Primitives
  { 
    category: 'Animation Primitives',
    items: [
      { id: 'fade-in', name: 'FadeIn', description: 'Fade opacity from 0 to 1' },
      { id: 'fade-out', name: 'FadeOut', description: 'Fade opacity from 1 to 0' },
      { id: 'slide-in', name: 'SlideIn', description: 'Slide in from direction' },
      { id: 'slide-out', name: 'SlideOut', description: 'Slide out to direction' },
      { id: 'scale-in', name: 'ScaleIn', description: 'Scale from 0 to 1' },
      { id: 'scale-out', name: 'ScaleOut', description: 'Scale from 1 to 0' },
      { id: 'stagger', name: 'Stagger', description: 'Sequential child animations' },
    ]
  },
  // Titles
  {
    category: 'Titles & Text',
    items: [
      { id: 'title-card', name: 'TitleCard', description: 'Full-screen title with subtitle' },
      { id: 'lower-third', name: 'LowerThird', description: 'Name and title overlay' },
      { id: 'quote-block', name: 'QuoteBlock', description: 'Quotation with attribution' },
    ]
  },
  // Data Viz
  {
    category: 'Data Visualization',
    items: [
      { id: 'line-chart', name: 'LineChart', description: 'Animated line graph' },
      { id: 'bar-chart', name: 'BarChart', description: 'Dynamic bar chart' },
      { id: 'pie-chart', name: 'PieChart', description: 'Circular chart with slices' },
      { id: 'stat-block', name: 'StatBlock', description: 'Single statistic display' },
      { id: 'kpi-strip', name: 'KPIStrip', description: 'Multiple stats in a row' },
    ]
  },
  // Social
  {
    category: 'Social Media',
    items: [
      { id: 'instagram-post', name: 'InstagramPost', description: 'Instagram-style post card' },
      { id: 'tweet-embed', name: 'TweetEmbed', description: 'Twitter/X post recreation' },
    ]
  },
  // Effects
  {
    category: 'Effects & Animations',
    items: [
      { id: 'loading-spinner', name: 'LoadingSpinner', description: 'Animated loading indicators' },
      { id: 'particle-effect', name: 'ParticleEffect', description: 'Physics-based particles' },
      { id: 'character', name: 'Character', description: 'Animated personas' },
    ]
  },
  // Transitions
  {
    category: 'Transitions',
    items: [
      { id: 'cross-fade', name: 'CrossFade', description: 'Opacity transition' },
      { id: 'dip-to-color', name: 'DipToColor', description: 'Fade through color' },
      { id: 'push', name: 'Push', description: 'Push transition' },
      { id: 'wipe', name: 'Wipe', description: 'Wipe transition' },
    ]
  },
  // Layout
  {
    category: 'Layout & Structure',
    items: [
      { id: 'stack', name: 'Stack', description: 'Flexbox container' },
      { id: 'device-frame', name: 'DeviceFrame', description: 'Browser/phone mockup' },
      { id: 'progress-bar', name: 'ProgressBar', description: 'Progress indicator' },
      { id: 'end-card', name: 'EndCard', description: 'Video end screen' },
    ]
  }
];

export default function ComponentsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Components</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
          Browse all available components. Click on any component to see live demos and documentation.
        </p>

        <div className="space-y-12">
          {components.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-semibold mb-6">{category.category}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.items.map((component) => (
                  <Link
                    key={component.id}
                    href={`/docs/components/${component.id}`}
                    className="p-6 border rounded-lg hover:shadow-lg transition hover:border-blue-500"
                  >
                    <h3 className="font-semibold text-lg mb-2">{component.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {component.description}
                    </p>
                    <div className="mt-4 text-sm text-blue-600 dark:text-blue-400">
                      View docs →
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Installation</h2>
          <p className="mb-4">Install components using the CLI:</p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{`# Install a single component
npx remotion-ui add title-card

# Install multiple components
npx remotion-ui add fade-in bar-chart instagram-post

# Components with dependencies are automatically resolved
npx remotion-ui add kpi-strip  # Also installs stat-block, stagger, stack`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}