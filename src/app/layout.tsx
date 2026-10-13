import type { Metadata } from 'next';
import './globals.css';
import { getSiteConfig } from '@/lib/config';
import { localBusinessJsonLd } from '@/lib/jsonld';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MobilePhoneBar from '@/components/MobilePhoneBar';

const cfg = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(cfg.business.siteUrl),
  title: {
    default: `${cfg.business.name} — ${cfg.business.tagline}`,
    template: `%s · ${cfg.business.name}`,
  },
  description: cfg.business.shortDescription,
  openGraph: {
    type: 'website',
    siteName: cfg.business.name,
    title: `${cfg.business.name} — ${cfg.business.tagline}`,
    description: cfg.business.shortDescription,
    url: cfg.business.siteUrl,
  },
  twitter: { card: 'summary_large_image', title: cfg.business.name, description: cfg.business.shortDescription },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
        />
      </head>
      <body className="min-h-screen flex flex-col pb-16 md:pb-0">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <MobilePhoneBar />
      </body>
    </html>
  );
}
