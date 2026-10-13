import Link from 'next/link';
import { getSiteConfig, telHref } from '@/lib/config';
import LeadForm from './LeadForm';

export default function Hero() {
  const { business } = getSiteConfig();
  return (
    <section className="relative bg-charcoal text-cream overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse at 15% 20%, rgba(184,137,61,0.35) 0%, rgba(26,26,26,0) 55%), radial-gradient(ellipse at 85% 80%, rgba(184,137,61,0.22) 0%, rgba(26,26,26,0) 55%), linear-gradient(135deg, #1a1a1a 0%, #2a2420 100%)',
        }}
      />
      <div className="relative container-wide py-16 md:py-24 grid gap-12 md:grid-cols-2 items-center">
        <div>
          <div className="uppercase tracking-widest text-xs text-bronze mb-4 font-semibold">
            Serving Toronto & the GTA
          </div>
          <h1 className="display text-4xl md:text-5xl lg:text-6xl leading-[1.08] mb-5">
            Interior finishes that outlast your renovation.
          </h1>
          <p className="text-lg text-cream/80 mb-8 max-w-xl">
            Epoxy flooring, polished concrete, decorative overlays, and architectural stucco —
            installed by the Decor Coatings team now operating across the GTA year-round.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={telHref(business.phone)} className="btn-primary">
              Call {business.phoneDisplay}
            </a>
            <Link href="/services" className="btn-outline !border-cream !text-cream hover:!bg-cream hover:!text-charcoal">
              See services
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-cream/70">
            <div><span className="text-bronze">●</span> Licensed & insured</div>
            <div><span className="text-bronze">●</span> Written warranties</div>
            <div><span className="text-bronze">●</span> GTA-wide, same team</div>
          </div>
        </div>
        <div className="bg-cream text-charcoal rounded-sm shadow-2xl p-6 md:p-8">
          <div className="display text-xl md:text-2xl mb-1">Get a free quote</div>
          <p className="text-sm text-softgray mb-5">
            Tell us about your project. We respond same-day during business hours.
          </p>
          <LeadForm variant="compact" />
        </div>
      </div>
    </section>
  );
}
