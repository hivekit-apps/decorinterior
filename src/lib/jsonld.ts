import { getSiteConfig, type Service, type City } from './config';

export function localBusinessJsonLd(): object {
  const { business } = getSiteConfig();
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${business.siteUrl}#business`,
    name: business.name,
    url: business.siteUrl,
    telephone: business.phone,
    email: business.email,
    description: business.shortDescription,
    parentOrganization: {
      '@type': 'Organization',
      name: business.parentName,
      url: business.parentUrl,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Greater Toronto Area',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '08:00',
        closes: '16:00',
        description: 'By appointment',
      },
    ],
  };
}

export function serviceJsonLd(service: Service, city?: City): object {
  const { business } = getSiteConfig();
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: business.name,
      telephone: business.phone,
      url: business.siteUrl,
    },
    areaServed: city
      ? { '@type': 'City', name: city.name }
      : { '@type': 'AdministrativeArea', name: 'Greater Toronto Area' },
  };
}

export function breadcrumbJsonLd(crumbs: Array<{ name: string; url: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export function faqJsonLd(faqs: Array<{ q: string; a: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
