import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Service Areas — Toronto & the GTA',
  description:
    'Decor Interior serves Toronto, York, Peel, Halton, and Durham regions. Twenty-plus cities across the GTA with same-day or next-day scheduling.',
};

export default function ServiceAreasPage() {
  const cfg = getSiteConfig();
  const regions = Array.from(new Set(cfg.cities.map((c) => c.region)));

  return (
    <div className="py-16 bg-cream">
      <div className="container-wide">
        <nav className="text-xs uppercase tracking-widest text-softgray mb-6">
          <Link href="/" className="hover:text-bronze">Home</Link> / Service Areas
        </nav>

        <header className="max-w-3xl mb-12">
          <p className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">Where we work</p>
          <h1 className="display text-4xl md:text-5xl mb-5">Toronto, York, Peel, Halton, and Durham.</h1>
          <p className="text-softgray text-lg leading-relaxed">
            We work across the full GTA from a central dispatch, with same-day scheduling in the core
            regions and next-day scheduling in Durham. The same crew handles every project — we don&apos;t
            sub out the install.
          </p>
        </header>

        {regions.map((region) => {
          const items = cfg.cities.filter((c) => c.region === region);
          return (
            <section key={region} className="mb-12">
              <h2 className="display text-2xl md:text-3xl mb-5 border-b border-charcoal/10 pb-3">{region} Region</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/service-areas/${c.slug}`}
                    className="group block border border-charcoal/10 rounded-sm p-6 hover:border-bronze hover:shadow-md transition bg-white"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="display text-xl">{c.name}</h3>
                      <span className="text-[10px] uppercase tracking-wider text-bronze font-semibold">
                        {c.drivetime === 'same-day' ? 'Same-day' : 'Next-day'}
                      </span>
                    </div>
                    <p className="text-sm text-softgray mb-3 line-clamp-3">{c.localContext}</p>
                    <span className="text-sm text-bronze font-semibold group-hover:underline">
                      Services in {c.name} →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
