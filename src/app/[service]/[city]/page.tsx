import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSiteConfig, getService, getCity, getNearbyCities, telHref } from '@/lib/config';
import { breadcrumbJsonLd, faqJsonLd, localBusinessJsonLd, serviceJsonLd } from '@/lib/jsonld';
import { crossPageParagraphs, crossPageFaqs } from '@/lib/cross-content';
import LeadForm from '@/components/LeadForm';

export const revalidate = 300;
export const dynamicParams = true;

// Build-time prerender: all highlighted cities × all services.
// Non-highlighted combinations fall back to on-demand ISR.
export function generateStaticParams() {
  const cfg = getSiteConfig();
  const cities = cfg.cities.filter((c) => c.isHighlighted);
  const params: Array<{ service: string; city: string }> = [];
  for (const s of cfg.services) {
    for (const c of cities) {
      params.push({ service: s.slug, city: c.slug });
    }
  }
  return params;
}

export function generateMetadata({
  params,
}: { params: { service: string; city: string } }): Metadata {
  const s = getService(params.service);
  const c = getCity(params.city);
  if (!s || !c) return {};
  const cfg = getSiteConfig();
  const title = `${s.name} in ${c.name}`;
  const description = `${s.tagline} ${c.localContext.split('.')[0]}. Serving ${c.name} and the ${c.region} region.`;
  return {
    title,
    description,
    alternates: { canonical: `${cfg.business.siteUrl}/${s.slug}/${c.slug}` },
    openGraph: { title, description, url: `${cfg.business.siteUrl}/${s.slug}/${c.slug}` },
  };
}

export default function ServiceCityPage({
  params,
}: { params: { service: string; city: string } }) {
  const cfg = getSiteConfig();
  const s = getService(params.service);
  const c = getCity(params.city);
  if (!s || !c) return notFound();

  const paragraphs = crossPageParagraphs(s, c);
  const faqs = crossPageFaqs(s, c);
  const nearby = getNearbyCities(c.slug, 5);
  const otherServices = cfg.services.filter((x) => x.slug !== s.slug).slice(0, 6);

  const crumbs = [
    { name: 'Home', url: `${cfg.business.siteUrl}/` },
    { name: s.name, url: `${cfg.business.siteUrl}/services/${s.slug}` },
    { name: c.name, url: `${cfg.business.siteUrl}/${s.slug}/${c.slug}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(s, c)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }} />

      <section className="bg-charcoal text-cream py-16 md:py-20">
        <div className="container-wide">
          <nav className="text-xs uppercase tracking-widest text-cream/50 mb-5">
            <Link href="/" className="hover:text-bronze">Home</Link> / <Link href="/services" className="hover:text-bronze">Services</Link> / <Link href={`/services/${s.slug}`} className="hover:text-bronze">{s.shortName}</Link> / <span className="text-cream/80">{c.name}</span>
          </nav>
          <div className="max-w-3xl">
            <p className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">
              {c.region} · {c.drivetime === 'same-day' ? 'Same-day consult' : 'Next-day consult'}
            </p>
            <h1 className="display text-4xl md:text-5xl mb-5 leading-tight">
              {s.name} in {c.name}
            </h1>
            <p className="text-lg text-cream/80">{s.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={telHref(cfg.business.phone)} className="btn-primary">
                Call {cfg.business.phoneDisplay}
              </a>
              <a href="#quote" className="btn-outline !border-cream !text-cream hover:!bg-cream hover:!text-charcoal">
                Request a quote
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="container-wide grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="display text-2xl md:text-3xl mb-5">
                {s.name} in {c.name} — what to know
              </h2>
              <div className="space-y-4 text-softgray leading-relaxed">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="display text-xl mb-3">Process</h3>
                <ol className="space-y-2 text-sm text-softgray">
                  {s.process.slice(0, 5).map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-bronze font-semibold">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="display text-xl mb-3">Included</h3>
                <ul className="space-y-2 text-sm text-softgray">
                  {s.features.slice(0, 5).map((f, i) => (
                    <li key={i} className="flex gap-2"><span className="text-bronze">●</span>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            {c.neighborhoods.length > 0 && (
              <div>
                <h3 className="display text-xl mb-3">Neighbourhoods in {c.name}</h3>
                <p className="text-sm text-softgray mb-3">We work across every part of {c.name}, including:</p>
                <div className="flex flex-wrap gap-2">
                  {c.neighborhoods.map((n) => (
                    <span key={n} className="text-xs border border-charcoal/10 px-2.5 py-1 rounded-sm text-softgray">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="display text-xl mb-4">Common questions</h3>
              <div className="space-y-3">
                {faqs.map((f, i) => (
                  <details key={i} className="group border border-charcoal/10 bg-white rounded-sm">
                    <summary className="cursor-pointer px-5 py-4 font-semibold text-charcoal flex justify-between items-center text-sm">
                      {f.q}
                      <span className="text-bronze transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="px-5 pb-4 text-sm text-softgray leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <aside id="quote">
            <div className="bg-white border border-charcoal/10 rounded-sm p-6 shadow-sm lg:sticky lg:top-6">
              <div className="display text-xl mb-1">Get a quote</div>
              <p className="text-sm text-softgray mb-5">
                {s.shortName} in {c.name} — tell us about the project.
              </p>
              <LeadForm variant="full" defaultService={s.slug} defaultCity={c.slug} />
            </div>
          </aside>
        </div>
      </section>

      {/* Cross-links */}
      <section className="py-16 bg-white border-t border-charcoal/10">
        <div className="container-wide grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="display text-2xl mb-4">Other services in {c.name}</h2>
            <ul className="space-y-2 text-sm">
              {otherServices.map((os) => (
                <li key={os.slug}>
                  <Link href={`/${os.slug}/${c.slug}`} className="text-charcoal hover:text-bronze transition">
                    → {os.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href={`/service-areas/${c.slug}`} className="text-bronze font-semibold hover:underline">
                  All services in {c.name} →
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="display text-2xl mb-4">{s.shortName} in nearby cities</h2>
            <ul className="space-y-2 text-sm">
              {nearby.map((nc) => (
                <li key={nc.slug}>
                  <Link href={`/${s.slug}/${nc.slug}`} className="text-charcoal hover:text-bronze transition">
                    → {s.shortName} in {nc.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href={`/services/${s.slug}`} className="text-bronze font-semibold hover:underline">
                  All cities for {s.shortName} →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
