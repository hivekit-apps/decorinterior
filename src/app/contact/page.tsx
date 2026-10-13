import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteConfig, telHref } from '@/lib/config';
import LeadForm from '@/components/LeadForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Decor Interior — phone, email, and project inquiry form. Serving Toronto and the GTA.',
};

export default function ContactPage() {
  const cfg = getSiteConfig();
  return (
    <div className="py-16 bg-cream">
      <div className="container-wide">
        <nav className="text-xs uppercase tracking-widest text-softgray mb-6">
          <Link href="/" className="hover:text-bronze">Home</Link> / Contact
        </nav>
        <header className="max-w-3xl mb-10">
          <p className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">Contact</p>
          <h1 className="display text-4xl md:text-5xl mb-5">Let&apos;s talk about your project.</h1>
          <p className="text-softgray text-lg leading-relaxed">
            The fastest way to get a quote is to call. We respond same-day during business hours.
            If it&apos;s outside hours, send us a message and we&apos;ll follow up first thing.
          </p>
        </header>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <div className="bg-white border border-charcoal/10 rounded-sm p-6 md:p-8">
              <h2 className="display text-2xl mb-5">Request a quote</h2>
              <LeadForm variant="full" />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-charcoal text-cream rounded-sm p-6">
              <div className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">Call</div>
              <a href={telHref(cfg.business.phone)} className="display text-3xl hover:text-bronze transition block mb-1">
                {cfg.business.phoneDisplay}
              </a>
              <p className="text-sm text-cream/60">{cfg.business.hours}</p>
            </div>

            <div className="bg-white border border-charcoal/10 rounded-sm p-6">
              <div className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">Email</div>
              <a href={`mailto:${cfg.business.email}`} className="text-lg text-charcoal hover:text-bronze transition break-all">
                {cfg.business.email}
              </a>
              <p className="text-xs text-softgray mt-3">
                Same inbox as the parent brand — your request routes to the right team.
              </p>
            </div>

            <div className="bg-white border border-charcoal/10 rounded-sm p-6">
              <div className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">Service area</div>
              <p className="text-sm text-softgray leading-relaxed">
                Toronto, York Region, Peel Region, Halton Region, Durham Region. See the full list on the
                <Link href="/service-areas" className="text-bronze underline mx-1">service areas page</Link>.
              </p>
            </div>

            <div className="bg-white border border-charcoal/10 rounded-sm p-6">
              <div className="uppercase tracking-widest text-xs text-bronze font-semibold mb-3">Hours</div>
              <ul className="text-sm text-softgray space-y-1">
                <li>Monday – Friday: 7am – 7pm</li>
                <li>Saturday: by appointment</li>
                <li>Sunday: closed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
