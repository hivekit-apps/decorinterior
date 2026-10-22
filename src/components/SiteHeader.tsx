'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getSiteConfig, telHref } from '@/lib/config';

export default function SiteHeader() {
  const cfg = getSiteConfig();
  const { business, categories, services, cities } = cfg;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [areasOpen, setAreasOpen] = useState(false);

  // Highlighted cities first, then the rest — stable order for both dropdowns + mobile menu.
  const highlightedCities = cities.filter((c) => c.isHighlighted);
  const otherCities = cities.filter((c) => !c.isHighlighted);

  // Escape closes any open menu/dropdown.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setServicesOpen(false);
        setAreasOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll while mobile menu is open.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? 'hidden' : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <header className="border-b border-charcoal/10 bg-cream">
      <div className="container-wide flex items-center justify-between gap-3 py-4 md:py-5">
        <Link
          href="/"
          className="flex flex-col leading-tight"
          onClick={() => setMobileOpen(false)}
          aria-label={`${business.name} — home`}
        >
          <span className="display text-2xl md:text-3xl text-charcoal">{business.name}</span>
          <span className="text-xs md:text-sm text-softgray tracking-wide uppercase">
            by {business.parentName}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Primary">
          {/* Services dropdown */}
          <div className="relative" onMouseLeave={() => setServicesOpen(false)}>
            <button
              type="button"
              className="inline-flex items-center gap-1 hover:text-bronze transition"
              aria-expanded={servicesOpen}
              aria-haspopup="menu"
              aria-controls="menu-services-desktop"
              onMouseEnter={() => setServicesOpen(true)}
              onClick={() => setServicesOpen((v) => !v)}
            >
              Services
              <span aria-hidden className="text-xs">▾</span>
            </button>
            {servicesOpen && (
              <div
                id="menu-services-desktop"
                role="menu"
                className="absolute left-0 top-full z-40 mt-2 min-w-[560px] rounded-sm border border-charcoal/10 bg-cream p-5 shadow-lg"
              >
                <div className="grid grid-cols-2 gap-6">
                  {categories.map((cat) => {
                    const catServices = services.filter((s) => s.category === cat.slug);
                    if (catServices.length === 0) return null;
                    return (
                      <div key={cat.slug}>
                        <div className="uppercase tracking-wider text-xs text-bronze font-semibold mb-2">
                          {cat.name}
                        </div>
                        <ul className="space-y-1.5">
                          {catServices.map((s) => (
                            <li key={s.slug}>
                              <Link
                                href={`/services/${s.slug}`}
                                className="text-sm text-charcoal/80 hover:text-bronze hover:underline underline-offset-4"
                                onClick={() => setServicesOpen(false)}
                              >
                                {s.shortName}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 border-t border-charcoal/10 pt-3">
                  <Link
                    href="/services"
                    className="text-sm font-semibold text-bronze underline underline-offset-4"
                    onClick={() => setServicesOpen(false)}
                  >
                    All services &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Service Areas dropdown */}
          <div className="relative" onMouseLeave={() => setAreasOpen(false)}>
            <button
              type="button"
              className="inline-flex items-center gap-1 hover:text-bronze transition"
              aria-expanded={areasOpen}
              aria-haspopup="menu"
              aria-controls="menu-areas-desktop"
              onMouseEnter={() => setAreasOpen(true)}
              onClick={() => setAreasOpen((v) => !v)}
            >
              Service Areas
              <span aria-hidden className="text-xs">▾</span>
            </button>
            {areasOpen && (
              <div
                id="menu-areas-desktop"
                role="menu"
                className="absolute left-0 top-full z-40 mt-2 min-w-[360px] rounded-sm border border-charcoal/10 bg-cream p-5 shadow-lg"
              >
                {highlightedCities.length > 0 && (
                  <>
                    <div className="uppercase tracking-wider text-xs text-bronze font-semibold mb-2">
                      Core areas
                    </div>
                    <ul className="grid grid-cols-2 gap-x-5 gap-y-1.5 mb-4">
                      {highlightedCities.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/service-areas/${c.slug}`}
                            className="text-sm text-charcoal/80 hover:text-bronze hover:underline underline-offset-4"
                            onClick={() => setAreasOpen(false)}
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {otherCities.length > 0 && (
                  <>
                    <div className="uppercase tracking-wider text-xs text-bronze font-semibold mb-2">
                      Also serving
                    </div>
                    <ul className="grid grid-cols-2 gap-x-5 gap-y-1.5">
                      {otherCities.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/service-areas/${c.slug}`}
                            className="text-sm text-charcoal/80 hover:text-bronze hover:underline underline-offset-4"
                            onClick={() => setAreasOpen(false)}
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <div className="mt-4 border-t border-charcoal/10 pt-3">
                  <Link
                    href="/service-areas"
                    className="text-sm font-semibold text-bronze underline underline-offset-4"
                    onClick={() => setAreasOpen(false)}
                  >
                    All service areas &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/gallery" className="hover:text-bronze transition">Gallery</Link>
          <Link href="/about" className="hover:text-bronze transition">About</Link>
          <Link href="/contact" className="hover:text-bronze transition">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={telHref(business.phone)}
            className="hidden md:inline-flex items-center gap-2 bg-bronze text-white px-4 py-2 rounded-sm font-semibold text-sm hover:bg-bronzeDark transition"
          >
            <PhoneIcon />
            {business.phoneDisplay}
          </a>

          {/* Mobile burger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-sm border border-charcoal/20 p-2 text-charcoal"
            style={{ minHeight: 44, minWidth: 44 }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span aria-hidden style={{ fontSize: '1.25rem', lineHeight: 1 }}>
              {mobileOpen ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden w-full border-t border-charcoal/10 bg-cream">
          <nav
            key="mobile-open"
            className="container-wide flex flex-col py-4"
            aria-label="Mobile primary"
          >
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between py-2.5 text-base font-medium text-charcoal">
                <span>Services</span>
                <span aria-hidden className="text-softgray group-open:rotate-180 transition-transform text-xs">▾</span>
              </summary>
              <div className="pl-3 pb-2 space-y-3">
                {categories.map((cat) => {
                  const catServices = services.filter((s) => s.category === cat.slug);
                  if (catServices.length === 0) return null;
                  return (
                    <div key={cat.slug}>
                      <div className="uppercase tracking-wider text-xs text-bronze font-semibold py-1.5">
                        {cat.name}
                      </div>
                      <ul className="pl-3 space-y-1">
                        {catServices.map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={`/services/${s.slug}`}
                              className="block py-1.5 text-sm text-charcoal/80"
                              onClick={() => setMobileOpen(false)}
                            >
                              {s.shortName}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
                <Link
                  href="/services"
                  className="block pt-2 text-sm font-semibold text-bronze underline underline-offset-4"
                  onClick={() => setMobileOpen(false)}
                >
                  All services &rarr;
                </Link>
              </div>
            </details>

            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between py-2.5 text-base font-medium text-charcoal">
                <span>Service Areas</span>
                <span aria-hidden className="text-softgray group-open:rotate-180 transition-transform text-xs">▾</span>
              </summary>
              <div className="pl-3 pb-2">
                {highlightedCities.length > 0 && (
                  <>
                    <div className="uppercase tracking-wider text-xs text-bronze font-semibold py-1.5">
                      Core areas
                    </div>
                    <ul className="pl-3 space-y-1 mb-2">
                      {highlightedCities.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/service-areas/${c.slug}`}
                            className="block py-1.5 text-sm text-charcoal/80"
                            onClick={() => setMobileOpen(false)}
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {otherCities.length > 0 && (
                  <>
                    <div className="uppercase tracking-wider text-xs text-bronze font-semibold py-1.5">
                      Also serving
                    </div>
                    <ul className="pl-3 space-y-1">
                      {otherCities.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/service-areas/${c.slug}`}
                            className="block py-1.5 text-sm text-charcoal/80"
                            onClick={() => setMobileOpen(false)}
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <Link
                  href="/service-areas"
                  className="block pt-2 text-sm font-semibold text-bronze underline underline-offset-4"
                  onClick={() => setMobileOpen(false)}
                >
                  All service areas &rarr;
                </Link>
              </div>
            </details>

            <Link
              href="/gallery"
              className="py-2.5 text-base font-medium text-charcoal border-t border-charcoal/10"
              onClick={() => setMobileOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/about"
              className="py-2.5 text-base font-medium text-charcoal"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="py-2.5 text-base font-medium text-charcoal"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
            <a
              href={telHref(business.phone)}
              className="mt-3 inline-flex items-center justify-center gap-2 bg-bronze text-white px-4 py-3 rounded-sm font-semibold text-sm hover:bg-bronzeDark transition"
              onClick={() => setMobileOpen(false)}
            >
              <PhoneIcon />
              Call {business.phoneDisplay}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.73 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.36 1.85.6 2.81.73A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}
