import { getSiteConfig, telHref } from '@/lib/config';

export default function MobilePhoneBar() {
  const { business } = getSiteConfig();
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-charcoal border-t border-bronze shadow-lg">
      <a
        href={telHref(business.phone)}
        className="flex items-center justify-center gap-2 py-3 text-cream font-semibold text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.73 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.36 1.85.6 2.81.73A2 2 0 0 1 22 16.92z"/>
        </svg>
        Call {business.phoneDisplay}
      </a>
    </div>
  );
}
