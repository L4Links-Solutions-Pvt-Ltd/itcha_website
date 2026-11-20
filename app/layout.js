import { Inter, DM_Serif_Display } from 'next/font/google';
import { site } from '@/lib/site';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const serif = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-serif', display: 'swap' });

// VERCEL_ENV is 'production' only for the main branch; the dev branch deploys as 'preview'.
const isProd = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production';

export const metadata = {
  ...(isProd ? {} : { robots: { index: false, follow: false } }),
  metadataBase: new URL(site.url),
  title: { default: `${site.shortName} | ${site.name}, ${site.state}`, template: `%s | ${site.shortName}` },
  description: `${site.name} (${site.shortName}), ${site.state}. ${site.tagline}`,
  icons: { icon: '/logo.png', apple: '/apple-touch-icon.png' },
  openGraph: { title: `${site.shortName} | ${site.name}`, description: site.tagline, images: ['/logo.png'] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <body>
        {!isProd && <div className="env-banner">DEV site &middot; test data only</div>}
        {children}
      </body>
    </html>
  );
}
