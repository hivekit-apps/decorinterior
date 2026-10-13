import Link from 'next/link';
import { getSiteConfig, telHref } from '@/lib/config';

export default function SiteFooter() {
  const cfg = getSiteConfig();
  const { business } = cfg;
  const topServices = cfg.services.slice(0, 6);
  const topCities = cfg.cities.filter((c) => c.isHighlighted);
  return (
    <footer className="bg-charcoal text-cream mt-24">
      <div className="container-wide py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="display text-2xl mb-2">{business.name}</div>
          <p className="text-sm text-cream/70 mb-4">{business.shortDescription}</p>
          <p className="text-xs text-cream/60">Sub-brand of <a className="underline hover:text-bronze" href={business.parentUrl}>{business.parentName}</a></p>
        </div>
        <div>
          <div className="uppercase tracking-wider text-xs text-cream/60 mb-3">Services</div>
          <ul className="space-y-2 text-sm">
            {topServices.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-bronze transition">{s.shortName}</Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="text-bronze font-semibold hover:underline">All services →</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="uppercase tracking-wider text-xs text-cream/60 mb-3">Core Service Areas</div>
          <ul className="space-y-2 text-sm">
            {topCities.map((c) => (
              <li key={c.slug}>
                <Link href={`/service-areas/${c.slug}`} className="hover:text-bronze transition">{c.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/service-areas" className="text-bronze font-semibold hover:underline">All areas →</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="uppercase tracking-wider text-xs text-cream/60 mb-3">Contact</div>
          <ul className="space-y-2 text-sm">
            <li><a href={telHref(business.phone)} className="hover:text-bronze">{business.phoneDisplay}</a></li>
            <li><a href={`mailto:${business.email}`} className="hover:text-bronze">{business.email}</a></li>
            <li className="text-cream/60">{business.hours}</li>
            <li className="text-cream/60">{business.basedIn}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-wide py-5 text-xs text-cream/50 flex flex-col md:flex-row justify-between gap-2">
          <div>© {new Date().getFullYear()} {business.parentName}. All rights reserved.</div>
          <div>Built for the GTA. Operating year-round.</div>
        </div>
      </div>
    </footer>
  );
}
