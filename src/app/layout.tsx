import type { Metadata } from 'next';
import { Instrument_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from './providers';
import { BottomNavbar } from '@/components/layout/BottomNavbar';
import { TopBar } from '@/components/layout/TopBar';

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'BUILDRS',
  description: 'You are what you build.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          instrument.variable
        )}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col bg-background">
            <TopBar />
            <main className="flex-1 pt-16 pb-16">{children}</main>
            <BottomNavbar />
          </div>
        </Providers>
      </body>
    </html>
  );
}