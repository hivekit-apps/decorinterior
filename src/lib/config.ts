// Single source of truth for site content. Load business info, services, and
// cities from one JSON file. No hardcoded phone/email/city/service names in
// JSX — everything goes through here.

import rawConfig from '../../config/site.json';

export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type ServiceFaq = { q: string; a: string };

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  process: string[];
  idealFor: string[];
  faqs: ServiceFaq[];
  photo: string | null;
  photoAlt: string;
};

export type City = {
  slug: string;
  name: string;
  region: string;
  neighborhoods: string[];
  localContext: string;
  drivetime: 'same-day' | 'next-day';
  isHighlighted: boolean;
};

export type Business = {
  name: string;
  parentName: string;
  parentUrl: string;
  tagline: string;
  shortDescription: string;
  siteUrl: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  hours: string;
  basedIn: string;
  heroImage: string | null;
  heroImageAlt: string;
};

export type SiteConfig = {
  business: Business;
  categories: Category[];
  services: Service[];
  cities: City[];
  gallery: Array<{ src: string; alt: string; service?: string }>;
};

export function getSiteConfig(): SiteConfig {
  return rawConfig as SiteConfig;
}

export function getService(slug: string): Service | undefined {
  return getSiteConfig().services.find((s) => s.slug === slug);
}

export function getCity(slug: string): City | undefined {
  return getSiteConfig().cities.find((c) => c.slug === slug);
}

export function getServicesByCategory(categorySlug: string): Service[] {
  return getSiteConfig().services.filter((s) => s.category === categorySlug);
}

// Return cities near the given one (same region first, then same drivetime).
export function getNearbyCities(citySlug: string, limit = 5): City[] {
  const cfg = getSiteConfig();
  const target = cfg.cities.find((c) => c.slug === citySlug);
  if (!target) return [];
  const same = cfg.cities.filter((c) => c.region === target.region && c.slug !== citySlug);
  const others = cfg.cities.filter((c) => c.region !== target.region && c.slug !== citySlug);
  return [...same, ...others].slice(0, limit);
}

// Phone formatted for tel: link
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, '')}`;
}
