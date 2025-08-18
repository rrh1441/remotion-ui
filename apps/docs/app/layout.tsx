import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Remotion-UI - Beautiful Motion Components for Remotion',
  description: 'A comprehensive library of copy-paste components, assets, and presets for creating stunning videos with Remotion.',
  keywords: ['remotion', 'video', 'animation', 'components', 'motion graphics', 'react'],
  authors: [{ name: 'Remotion-UI Team' }],
  openGraph: {
    title: 'Remotion-UI',
    description: 'Beautiful motion components for Remotion',
    type: 'website',
    url: 'https://remotion-ui.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remotion-UI',
    description: 'Beautiful motion components for Remotion',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}