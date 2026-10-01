import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '900']
});

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700']
});

export const metadata: Metadata = {
  title: 'ITZ FIZZ - Scroll Driven Animation',
  description: 'Premium scroll-driven animated landing page for ITZ FIZZ.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} font-body bg-cream text-warm-black antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
