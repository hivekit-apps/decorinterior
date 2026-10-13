import Link from 'next/link';
import { getSiteConfig, telHref } from '@/lib/config';
import Hero from '@/components/Hero';

export default function HomePage() {
  const cfg = getSiteConfig();
  const topServices = cfg.services.slice(0, 6);
  const highlightedCities = cfg.cities.filter((c) => c.isHighlighted);
  const allCities = cfg.cities;

  return (
    <>
      <Hero />

      {/* Why Decor Interior */}
      <section className="py-20 bg-cream">
        <div className="container-wide">
          <div className="max-w-prose mb-10">
            <p className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">Why Decor Interior</p>
            <h2 className="display text-3xl md:text-4xl mb-5">
              The same team that finishes GTA facades is now working inside.
            </h2>
            <p className="text-softgray leading-relaxed">
              Decor Coatings has been finishing exterior stucco and concrete across Ontario for years.
              Decor Interior is the natural extension — the same crews, same quality standard, same
              written warranties, now applied to the interior finishes that matter most: garage floors,
              basement coatings, polished concrete main floors, and architectural accent walls.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <ValueCard
              title="Proper surface prep"
              body="We mechanically grind every slab before coating — no acid-etch shortcuts. The prep is why our floors last a decade when others peel in two."
            />
            <ValueCard
              title="Specification by use case"
              body="A garage floor and a commercial kitchen floor need different systems. We spec based on how the floor will actually be used, not a one-size catalog."
            />
            <ValueCard
              title="Honest scheduling"
              body="We quote by site visit, book realistic dates, and show up when we say we will. Interior work demands empty rooms — we respect your family's schedule."
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <div className="flex flex-wrap items-end justify-between mb-10 gap-6">
            <div>
              <p className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">Services</p>
              <h2 className="display text-3xl md:text-4xl">What we install.</h2>
            </div>
            <Link href="/services" className="btn-ghost">All services →</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {topServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group block border border-charcoal/10 rounded-sm p-6 hover:border-bronze hover:shadow-md transition bg-cream"
              >
                <div className="uppercase tracking-wider text-[10px] text-bronze font-semibold mb-2">
                  {cfg.categories.find((c) => c.slug === s.category)?.name || s.category}
                </div>
                <h3 className="display text-xl mb-2">{s.name}</h3>
                <p className="text-sm text-softgray mb-4 leading-relaxed">{s.tagline}</p>
                <span className="text-sm text-bronze font-semibold group-hover:underline">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Service areas */}
      <section className="py-20 bg-charcoal text-cream">
        <div className="container-wide">
          <div className="flex flex-wrap items-end justify-between mb-10 gap-6">
            <div>
              <p className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">Where we work</p>
              <h2 className="display text-3xl md:text-4xl">GTA-wide, year-round.</h2>
              <p className="mt-3 text-cream/70 max-w-xl">Core cities get same-day scheduling. The full GTA is same-week.</p>
            </div>
            <Link href="/service-areas" className="btn-outline !border-cream !text-cream hover:!bg-cream hover:!text-charcoal">
              All service areas
            </Link>
          </div>

          <div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
            {highlightedCities.map((c) => (
              <Link
                key={c.slug}
                href={`/service-areas/${c.slug}`}
                className="border border-bronze/40 bg-bronze/10 p-4 rounded-sm hover:bg-bronze hover:text-white transition text-center"
              >
                <div className="font-semibold text-sm">{c.name}</div>
                <div className="text-[11px] opacity-70 mt-1 uppercase tracking-wider">{c.region}</div>
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            {allCities
              .filter((c) => !c.isHighlighted)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/service-areas/${c.slug}`}
                  className="border border-cream/20 px-3 py-1.5 rounded-sm hover:border-bronze hover:text-bronze transition"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Testimonial-style quote block */}
      <section className="py-20 bg-cream">
        <div className="container-tight text-center">
          <div className="display text-3xl md:text-4xl leading-snug text-charcoal mb-6">
            <span className="text-bronze">&ldquo;</span>They prepped the slab properly, showed up when they said they would, and the garage floor still looks new three winters later.<span className="text-bronze">&rdquo;</span>
          </div>
          <div className="text-softgray text-sm uppercase tracking-widest">— GTA homeowner · Garage epoxy install</div>
          <p className="mt-6 text-xs text-softgray/70">We&apos;re new to the GTA under the Decor Interior name — the parent brand Decor Coatings has a decade of exterior work and reviews behind it.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-charcoal text-cream">
        <div className="container-tight text-center">
          <h2 className="display text-3xl md:text-4xl mb-5">Thinking about an interior upgrade?</h2>
          <p className="text-cream/70 mb-8 max-w-xl mx-auto">
            Call for a same-day callback during business hours, or send us the details and we&apos;ll follow up.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={telHref(cfg.business.phone)} className="btn-primary">
              Call {cfg.business.phoneDisplay}
            </a>
            <Link href="/contact" className="btn-outline !border-cream !text-cream hover:!bg-cream hover:!text-charcoal">
              Send a message
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ValueCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white border border-charcoal/10 p-6 rounded-sm">
      <div className="text-bronze display text-2xl mb-3">●</div>
      <h3 className="display text-xl mb-3">{title}</h3>
      <p className="text-sm text-softgray leading-relaxed">{body}</p>
    </div>
  );
}
