import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteConfig, telHref } from '@/lib/config';

export const metadata: Metadata = {
  title: 'About',
  description: 'Decor Interior is the interior-finishes sub-brand of Decor Coatings — bringing the same crews and standards to GTA homes and commercial spaces year-round.',
};

export default function AboutPage() {
  const cfg = getSiteConfig();
  return (
    <div className="py-16 bg-cream">
      <div className="container-wide">
        <nav className="text-xs uppercase tracking-widest text-softgray mb-6">
          <Link href="/" className="hover:text-bronze">Home</Link> / About
        </nav>
        <header className="max-w-3xl mb-12">
          <p className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">About us</p>
          <h1 className="display text-4xl md:text-5xl mb-5">The same team. The same standards. Now inside.</h1>
        </header>

        <div className="max-w-prose space-y-6 text-softgray leading-relaxed text-base">
          <p>
            <strong className="text-charcoal">Decor Interior</strong> is the interior-finishes sub-brand
            of <a href={cfg.business.parentUrl} className="text-bronze underline">{cfg.business.parentName}</a>,
            a stucco and concrete coatings company based in Eastern Ontario that&apos;s been finishing
            exterior facades across the Kingston–Belleville–Napanee corridor for years.
          </p>
          <p>
            The pivot to interior work is practical. Exterior stucco is a seasonal trade: when it&apos;s
            below freezing or sheeting with rain, the crews can&apos;t safely apply materials outdoors.
            Interior finishes — epoxy flooring, polished concrete, decorative overlays, interior stucco —
            don&apos;t care about the weather. By extending our service into GTA interiors, we keep the
            same crews working year-round and bring a mature set of surface-prep and finishing skills
            to a market that&apos;s often served by less-experienced generalists.
          </p>
          <p>
            Everything we install indoors is built on the same discipline we use outdoors: mechanical
            surface preparation, substrate-matched specifications, written warranties, and finish work
            by the same crew that quoted the job. We don&apos;t sub out the install.
          </p>
          <p>
            We serve Toronto and the full GTA — York, Peel, Halton, and Durham regions — with same-day
            or next-day consult scheduling and same-week installs typical for most projects.
          </p>
          <h2 className="display text-2xl text-charcoal mt-10 mb-3">Who we work with</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>Homeowners finishing basements, garages, laundry rooms, and workshops</li>
            <li>General contractors and renovation crews looking for a reliable concrete-finish partner</li>
            <li>Designers and architects speccing polished concrete or decorative overlays</li>
            <li>Property managers and commercial-space owners needing durable, serviceable floors</li>
            <li>Builders needing garage epoxy as a standard upgrade option</li>
          </ul>
          <h2 className="display text-2xl text-charcoal mt-10 mb-3">What makes us different</h2>
          <p>
            Three things, in order of importance: (1) we always mechanically prep concrete — no acid
            etch, no shortcuts; (2) we spec systems based on how the floor or wall will actually be
            used, not on what&apos;s cheapest to install; (3) the crew that quotes is the crew that
            installs, which means accountability is end-to-end.
          </p>
        </div>

        <div className="mt-14 bg-charcoal text-cream rounded-sm p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="display text-2xl mb-1">Ready to talk about your project?</div>
            <p className="text-cream/70 text-sm">Call for a same-day callback or send us the details.</p>
          </div>
          <div className="flex gap-3">
            <a href={telHref(cfg.business.phone)} className="btn-primary">
              Call {cfg.business.phoneDisplay}
            </a>
            <Link href="/contact" className="btn-outline !border-cream !text-cream hover:!bg-cream hover:!text-charcoal">
              Send a message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
