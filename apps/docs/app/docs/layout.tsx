import Link from 'next/link';
import type { ReactNode } from 'react';

const navigation = [
  { name: 'Getting Started', href: '/docs' },
  { name: 'Installation', href: '/docs/installation' },
  { name: 'Components', href: '/docs/components' },
  { name: 'Assets', href: '/docs/assets' },
  { name: 'Examples', href: '/docs/examples' },
];

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold">
            Remotion-UI
          </Link>
        </div>
        <nav className="px-4 pb-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}