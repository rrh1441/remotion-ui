import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Documentation</h1>
          
          <div className="space-y-12">
            {/* Getting Started */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Link
                  href="/docs/installation"
                  className="p-6 border rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-2">Installation</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Set up Remotion-UI in your project
                  </p>
                </Link>
                <Link
                  href="/docs/quick-start"
                  className="p-6 border rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-2">Quick Start</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Create your first video with our components
                  </p>
                </Link>
              </div>
            </section>

            {/* Components */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Components</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Link
                  href="/docs/components/titles"
                  className="p-4 border rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-1">Titles & Text</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    TitleCard, LowerThird, QuoteBlock
                  </p>
                </Link>
                <Link
                  href="/docs/components/data-viz"
                  className="p-4 border rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-1">Data Visualization</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    LineChart, BarChart, PieChart
                  </p>
                </Link>
                <Link
                  href="/docs/components/social"
                  className="p-4 border rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-1">Social Media</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    InstagramPost, TweetEmbed
                  </p>
                </Link>
                <Link
                  href="/docs/components/transitions"
                  className="p-4 border rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-1">Transitions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    CrossFade, DipToColor, Push
                  </p>
                </Link>
                <Link
                  href="/docs/components/animations"
                  className="p-4 border rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-1">Animations</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    FadeIn, SlideIn, ScaleIn
                  </p>
                </Link>
                <Link
                  href="/docs/components/characters"
                  className="p-4 border rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-1">Characters</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Animated personas with emotions
                  </p>
                </Link>
              </div>
            </section>

            {/* Assets */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Assets</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Link
                  href="/docs/assets/icons"
                  className="p-6 border rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-2">Icons</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    70+ production-ready icons in outline and solid styles
                  </p>
                </Link>
                <Link
                  href="/docs/assets/shapes"
                  className="p-6 border rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-2">Shapes & Backgrounds</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Decorative elements and backgrounds for your videos
                  </p>
                </Link>
              </div>
            </section>

            {/* Examples */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Examples</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Link
                  href="/docs/examples/product-demo"
                  className="p-6 border rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-2">Product Demo</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Create engaging product demonstration videos
                  </p>
                </Link>
                <Link
                  href="/docs/examples/social-media"
                  className="p-6 border rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="font-semibold mb-2">Social Media Ads</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Build eye-catching social media content
                  </p>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}