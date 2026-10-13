import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSiteConfig, getCity, getNearbyCities } from '@/lib/config';
import { breadcrumbJsonLd, localBusinessJsonLd } from '@/lib/jsonld';
import LeadForm from '@/components/LeadForm';

export const revalidate = 300;

export function generateStaticParams() {
  return getSiteConfig().cities.map((c) => ({ city: c.slug }));
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const c = getCity(params.city);
  if (!c) return {};
  const cfg = getSiteConfig();
  const title = `Interior Finishes in ${c.name}`;
  const description = `Epoxy flooring, polished concrete, decorative overlays, and interior stucco in ${c.name}, ${c.region}. ${cfg.business.parentName} crew — same-week scheduling across the GTA.`;
  return {
    title,
    description,
    alternates: { canonical: `${cfg.business.siteUrl}/service-areas/${c.slug}` },
    openGraph: { title, description, url: `${cfg.business.siteUrl}/service-areas/${c.slug}` },
  };
}

export default function CityPage({ params }: { params: { city: string } }) {
  const cfg = getSiteConfig();
  const c = getCity(params.city);
  if (!c) return notFound();
  const nearby = getNearbyCities(c.slug, 6);

  const crumbs = [
    { name: 'Home', url: `${cfg.business.siteUrl}/` },
    { name: 'Service Areas', url: `${cfg.business.siteUrl}/service-areas` },
    { name: c.name, url: `${cfg.business.siteUrl}/service-areas/${c.slug}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />

      <section className="bg-charcoal text-cream py-16 md:py-20">
        <div className="container-wide">
          <nav className="text-xs uppercase tracking-widest text-cream/50 mb-5">
            <Link href="/" className="hover:text-bronze">Home</Link> / <Link href="/service-areas" className="hover:text-bronze">Service Areas</Link> / <span className="text-cream/80">{c.name}</span>
          </nav>
          <div className="max-w-3xl">
            <p className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">
              {c.region} Region · {c.drivetime === 'same-day' ? 'Same-day scheduling' : 'Next-day scheduling'}
            </p>
            <h1 className="display text-4xl md:text-5xl mb-5 leading-tight">
              Interior Finishes in {c.name}
            </h1>
            <p className="text-lg text-cream/80">{c.localContext}</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="container-wide">
          <h2 className="display text-2xl md:text-3xl mb-6">Services available in {c.name}</h2>
          <p className="text-softgray mb-8 max-w-prose">
            Every service below is available in {c.name}. Click through for a city-specific landing
            page covering local considerations, process, and FAQs.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cfg.services.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}/${c.slug}`}
                className="group block border border-charcoal/10 rounded-sm p-6 hover:border-bronze hover:shadow-md transition bg-white"
              >
                <div className="uppercase tracking-wider text-[10px] text-bronze font-semibold mb-2">
                  {cfg.categories.find((cat) => cat.slug === s.category)?.name}
                </div>
                <h3 className="display text-lg mb-2">{s.name}</h3>
                <p className="text-sm text-softgray mb-3 line-clamp-2">{s.tagline}</p>
                <span className="text-sm text-bronze font-semibold group-hover:underline">
                  {s.shortName} in {c.name} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-charcoal/10">
        <div className="container-wide grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {c.neighborhoods.length > 0 && (
              <div>
                <h2 className="display text-2xl mb-4">Neighbourhoods we serve</h2>
                <div className="flex flex-wrap gap-2">
                  {c.neighborhoods.map((n) => (
                    <span key={n} className="text-sm border border-charcoal/10 px-3 py-1.5 rounded-sm text-softgray">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {nearby.length > 0 && (
              <div>
                <h2 className="display text-2xl mb-4">Nearby cities we also serve</h2>
                <div className="flex flex-wrap gap-2">
                  {nearby.map((n) => (
                    <Link
                      key={n.slug}
                      href={`/service-areas/${n.slug}`}
                      className="text-sm border border-charcoal/10 px-3 py-1.5 rounded-sm hover:border-bronze hover:text-bronze transition"
                    >
                      {n.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside>
            <div className="bg-cream border border-charcoal/10 rounded-sm p-6 lg:sticky lg:top-6">
              <div className="display text-xl mb-1">Request a quote</div>
              <p className="text-sm text-softgray mb-5">Based in {c.name}? Tell us about your project.</p>
              <LeadForm variant="full" defaultCity={c.slug} />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
