import Link from 'next/link';
import { getSiteConfig, telHref } from '@/lib/config';

export default function SiteHeader() {
  const { business } = getSiteConfig();
  return (
    <header className="border-b border-charcoal/10 bg-cream">
      <div className="container-wide flex items-center justify-between py-4 md:py-5">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="display text-2xl md:text-3xl text-charcoal">{business.name}</span>
          <span className="text-xs md:text-sm text-softgray tracking-wide uppercase">
            by {business.parentName}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/services" className="hover:text-bronze transition">Services</Link>
          <Link href="/service-areas" className="hover:text-bronze transition">Service Areas</Link>
          <Link href="/gallery" className="hover:text-bronze transition">Gallery</Link>
          <Link href="/about" className="hover:text-bronze transition">About</Link>
          <Link href="/contact" className="hover:text-bronze transition">Contact</Link>
        </nav>
        <a
          href={telHref(business.phone)}
          className="hidden md:inline-flex items-center gap-2 bg-bronze text-white px-4 py-2 rounded-sm font-semibold text-sm hover:bg-bronzeDark transition"
        >
          <PhoneIcon />
          {business.phoneDisplay}
        </a>
      </div>
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
