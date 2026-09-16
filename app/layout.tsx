import './globals.css';
import './portfolio-enhancements.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/sonner';

const supreme = localFont({ src: '../public/fonts/supreme-spike.woff', variable: '--font-supreme', display: 'swap' });

export const metadata: Metadata = {
  title: 'Me_4qan — Premium Motion Graphics & SaaS Explainers',
  description:
    'Premium motion graphics, SaaS explainers, product visuals, and cinematic digital experiences for technology and modern brands.',
  openGraph: {
    title: 'Me_4qan — Premium Motion Graphics & SaaS Explainers',
    description:
      'Premium motion graphics, SaaS explainers, product visuals, and cinematic digital experiences for technology and modern brands.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${supreme.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(16, 13, 24, 0.9)',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              color: '#e9d5ff',
            },
          }}
        />
      </body>
    </html>
  );
}
