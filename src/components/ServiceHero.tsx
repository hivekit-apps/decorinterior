import Link from 'next/link';
import Image from 'next/image';
import { getSiteConfig, telHref } from '@/lib/config';

type BreadcrumbItem = { label: string; href?: string };

export type ServiceHeroProps = {
  eyebrow: string;
  title: string;
  tagline: string;
  photo: string | null;
  photoAlt: string;
  breadcrumbs?: BreadcrumbItem[];
  quoteHref?: string;
};

/**
 * Canonical sub-page hero. Two-column at lg:
 *   - Text col (col-span-5) — eyebrow, breadcrumbs, h1, tagline, CTA pair
 *   - Image col (col-span-7) — bounded 4/3 image, max-h 560px, priority preload
 * At md and below: image appears above text, aspect-video, max-h 60vh.
 * LB-CS-13 negative-space discipline: py-14 md:py-20 outer. gap-10 lg:gap-12.
 * LB-CS-15: photo is a work-portfolio-service classification. NEVER a team-portrait.
 * LB-CS-16: image uses hero_2col named tier sizes.
 */
export default function ServiceHero({
  eyebrow,
  title,
  tagline,
  photo,
  photoAlt,
  breadcrumbs,
  quoteHref = '#quote',
}: ServiceHeroProps) {
  const { business } = getSiteConfig();
  return (
    <section className="relative bg-charcoal text-cream overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at 15% 20%, rgba(184,137,61,0.28) 0%, rgba(26,26,26,0) 55%), radial-gradient(ellipse at 85% 80%, rgba(184,137,61,0.18) 0%, rgba(26,26,26,0) 55%), linear-gradient(135deg, #1a1a1a 0%, #2a2420 100%)',
        }}
      />
      <div className="relative container-wide py-14 md:py-20">
        <div className="grid gap-10 lg:gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav
                aria-label="Breadcrumb"
                className="text-xs uppercase tracking-widest text-cream/50 mb-5"
              >
                {breadcrumbs.map((b, i) => (
                  <span key={i}>
                    {b.href ? (
                      <Link href={b.href} className="hover:text-bronze">
                        {b.label}
                      </Link>
                    ) : (
                      <span className="text-cream/80">{b.label}</span>
                    )}
                    {i < breadcrumbs.length - 1 && ' / '}
                  </span>
                ))}
              </nav>
            )}
            <p className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">
              {eyebrow}
            </p>
            <h1 className="display text-4xl md:text-5xl mb-5 leading-tight">
              {title}
            </h1>
            <p className="text-lg text-cream/80 max-w-prose">{tagline}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={telHref(business.phone)} className="btn-primary">
                Call {business.phoneDisplay}
              </a>
              <a
                href={quoteHref}
                className="btn-outline !border-cream !text-cream hover:!bg-cream hover:!text-charcoal"
              >
                Request a quote
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            {photo ? (
              <div className="relative aspect-[4/3] max-h-[560px] w-full overflow-hidden rounded-sm shadow-2xl ring-1 ring-cream/10">
                <Image
                  src={photo}
                  alt={photoAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className="relative aspect-[4/3] max-h-[560px] w-full overflow-hidden rounded-sm ring-1 ring-cream/10"
                style={{
                  background:
                    'linear-gradient(135deg, #2a2420 0%, #3a2f24 50%, #b8893d 100%)',
                }}
                aria-hidden
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
