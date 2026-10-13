import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Interior finish gallery — epoxy flooring, polished concrete, decorative overlays, and more by Decor Interior.',
};

export default function GalleryPage() {
  const cfg = getSiteConfig();
  const items = cfg.gallery.length > 0
    ? cfg.gallery.map((g) => ({ src: g.src, alt: g.alt, service: g.service }))
    // Fallback: placeholder cards grouped by service so the page isn't empty.
    : cfg.services.slice(0, 6).map((s) => ({
        src: null as string | null,
        alt: s.photoAlt,
        service: s.slug,
      }));

  return (
    <div className="py-16 bg-cream">
      <div className="container-wide">
        <nav className="text-xs uppercase tracking-widest text-softgray mb-6">
          <Link href="/" className="hover:text-bronze">Home</Link> / Gallery
        </nav>
        <header className="max-w-3xl mb-10">
          <p className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">Project gallery</p>
          <h1 className="display text-4xl md:text-5xl mb-5">Interior finishes we&apos;ve installed.</h1>
          <p className="text-softgray text-lg leading-relaxed">
            Project photos are being compiled from recent GTA installs. In the meantime, visit the
            <Link href="/services" className="text-bronze underline mx-1">services page</Link>
            for detailed descriptions of each system we offer.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const service = cfg.services.find((s) => s.slug === item.service);
            return (
              <div
                key={i}
                className="relative aspect-[4/3] rounded-sm overflow-hidden border border-charcoal/10"
                style={{
                  background:
                    'linear-gradient(135deg, #1a1a1a 0%, #3a2f24 50%, #b8893d 100%)',
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-cream">
                  <div className="uppercase text-[10px] tracking-widest text-bronze mb-1 font-semibold">
                    Coming soon
                  </div>
                  <div className="display text-xl">{service?.name || 'Project'}</div>
                  <div className="text-xs text-cream/70 mt-1">Photos uploading soon</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
