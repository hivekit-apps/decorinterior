import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSiteConfig, getService } from '@/lib/config';
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/jsonld';
import LeadForm from '@/components/LeadForm';

export const revalidate = 300;

export function generateStaticParams() {
  return getSiteConfig().services.map((s) => ({ service: s.slug }));
}

export function generateMetadata({ params }: { params: { service: string } }): Metadata {
  const s = getService(params.service);
  if (!s) return {};
  const cfg = getSiteConfig();
  const title = `${s.name} — Toronto & GTA`;
  const description = `${s.tagline} Serving Toronto and the GTA — specified, prepped, and installed by ${cfg.business.parentName}.`;
  return {
    title,
    description,
    alternates: { canonical: `${cfg.business.siteUrl}/services/${s.slug}` },
    openGraph: { title, description, url: `${cfg.business.siteUrl}/services/${s.slug}` },
  };
}

export default function ServiceDetailPage({ params }: { params: { service: string } }) {
  const cfg = getSiteConfig();
  const s = getService(params.service);
  if (!s) return notFound();

  const crumbs = [
    { name: 'Home', url: `${cfg.business.siteUrl}/` },
    { name: 'Services', url: `${cfg.business.siteUrl}/services` },
    { name: s.name, url: `${cfg.business.siteUrl}/services/${s.slug}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(s)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(s.faqs)) }} />

      {/* Hero */}
      <section className="bg-charcoal text-cream py-16 md:py-20">
        <div className="container-wide">
          <nav className="text-xs uppercase tracking-widest text-cream/50 mb-5">
            <Link href="/" className="hover:text-bronze">Home</Link> / <Link href="/services" className="hover:text-bronze">Services</Link> / <span className="text-cream/80">{s.shortName}</span>
          </nav>
          <div className="max-w-3xl">
            <p className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">
              {cfg.categories.find((c) => c.slug === s.category)?.name || s.category}
            </p>
            <h1 className="display text-4xl md:text-5xl mb-5 leading-tight">{s.name} — Toronto &amp; GTA</h1>
            <p className="text-lg text-cream/80">{s.tagline}</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 bg-cream">
        <div className="container-wide grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="display text-2xl md:text-3xl mb-5">About this service</h2>
              <p className="text-softgray leading-relaxed text-base">{s.description}</p>
            </div>

            <div>
              <h2 className="display text-2xl md:text-3xl mb-5">Our process</h2>
              <ol className="space-y-3 text-softgray">
                {s.process.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="text-bronze font-semibold w-6 shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="display text-2xl mb-4">What&apos;s included</h2>
                <ul className="space-y-2 text-sm text-softgray">
                  {s.features.map((f, i) => (
                    <li key={i} className="flex gap-2"><span className="text-bronze">●</span>{f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="display text-2xl mb-4">Ideal for</h2>
                <ul className="space-y-2 text-sm text-softgray">
                  {s.idealFor.map((f, i) => (
                    <li key={i} className="flex gap-2"><span className="text-bronze">●</span>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="display text-2xl md:text-3xl mb-5">Questions people ask</h2>
              <div className="space-y-4">
                {s.faqs.map((f, i) => (
                  <details key={i} className="group border border-charcoal/10 bg-white rounded-sm">
                    <summary className="cursor-pointer px-5 py-4 font-semibold text-charcoal flex justify-between items-center">
                      {f.q}
                      <span className="text-bronze transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="px-5 pb-4 text-sm text-softgray leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar lead form */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white border border-charcoal/10 rounded-sm p-6 shadow-sm">
              <div className="display text-xl mb-1">Request a quote</div>
              <p className="text-sm text-softgray mb-5">Tell us about your {s.shortName.toLowerCase()} project.</p>
              <LeadForm variant="full" defaultService={s.slug} />
            </div>
          </aside>
        </div>
      </section>

      {/* City links */}
      <section className="py-16 bg-white border-t border-charcoal/10">
        <div className="container-wide">
          <h2 className="display text-2xl md:text-3xl mb-2">We serve these cities</h2>
          <p className="text-softgray mb-6 text-sm">
            Each city page combines {s.shortName.toLowerCase()} details with local context for that area.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {cfg.cities.map((c) => (
              <Link
                key={c.slug}
                href={`/${s.slug}/${c.slug}`}
                className="text-sm border border-charcoal/10 px-3 py-2 rounded-sm hover:border-bronze hover:text-bronze transition flex items-center justify-between"
              >
                <span>{c.name}</span>
                <span className="text-softgray text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
