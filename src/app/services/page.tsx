import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Interior Finish Services',
  description:
    'Full range of interior finish services from Decor Interior — epoxy flooring, polished concrete, decorative overlays, interior stucco, and more across the GTA.',
};

export default function ServicesPage() {
  const cfg = getSiteConfig();
  return (
    <div className="py-16 bg-cream">
      <div className="container-wide">
        <nav className="text-xs uppercase tracking-widest text-softgray mb-6">
          <Link href="/" className="hover:text-bronze">Home</Link> / Services
        </nav>
        <header className="mb-12 max-w-3xl">
          <p className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">Services</p>
          <h1 className="display text-4xl md:text-5xl mb-5">
            Interior finishes for GTA homes and commercial spaces.
          </h1>
          <p className="text-softgray text-lg leading-relaxed">
            Eleven services across three categories — flooring, concrete finishes, and specialty work.
            Each is specified by the actual use case, not a catalog default. Everything is installed by
            the Decor Coatings team working year-round across the GTA.
          </p>
        </header>

        {cfg.categories.map((cat) => {
          const items = cfg.services.filter((s) => s.category === cat.slug);
          if (items.length === 0) return null;
          return (
            <section key={cat.slug} className="mb-14">
              <div className="flex items-end justify-between gap-4 mb-5 border-b border-charcoal/10 pb-3">
                <h2 className="display text-2xl md:text-3xl">{cat.name}</h2>
                <p className="text-sm text-softgray hidden md:block max-w-md text-right">{cat.description}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group block border border-charcoal/10 rounded-sm p-6 hover:border-bronze hover:shadow-md transition bg-white"
                  >
                    <h3 className="display text-xl mb-2">{s.name}</h3>
                    <p className="text-sm text-softgray mb-4 leading-relaxed">{s.tagline}</p>
                    <span className="text-sm text-bronze font-semibold group-hover:underline">
                      Learn more →
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
