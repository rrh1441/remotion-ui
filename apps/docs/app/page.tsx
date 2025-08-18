import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            Remotion-UI
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Beautiful, production-ready motion components for Remotion. 
            Copy, paste, and create stunning videos in minutes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/docs"
              className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
            <Link
              href="/docs/components"
              className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
            >
              Browse Components
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              20+ Components
            </h3>
            <p className="text-gray-400">
              Production-ready components for titles, transitions, and layouts.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              70+ Assets
            </h3>
            <p className="text-gray-400">
              Icons, shapes, backgrounds, and more - all optimized for video.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Copy & Paste
            </h3>
            <p className="text-gray-400">
              No complex setup. Just copy components into your project.
            </p>
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Install</h2>
          <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-400">
{`# Install the CLI
npm install -D @remotion-ui/cli

# Initialize in your project
npx remotion-ui init

# Add components
npx remotion-ui add title-card lower-third

# Add assets
npx remotion-ui add assets icons@v1`}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}