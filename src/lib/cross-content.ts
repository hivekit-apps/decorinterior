// Generate deterministic, varied content for service × city cross pages.
// Uses a seeded index derived from (service.slug + city.slug) to pick
// variants, so every page is reproducible yet distinct from its neighbours.

import type { Service, City } from './config';

function seed(a: string, b: string): number {
  let h = 2166136261;
  const s = a + '|' + b;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

function pick<T>(arr: T[], seedVal: number, offset = 0): T {
  return arr[(seedVal + offset) % arr.length];
}

const INTROS = [
  'We install',
  'Our team installs',
  'The Decor Coatings crew installs',
  'We handle',
  'Our GTA crew installs',
  'We specify and install',
];

const CITY_LEADS = [
  'across every corner of',
  'throughout',
  'in homes and commercial spaces across',
  'for homeowners and businesses in',
  'in residential and commercial projects across',
  'for projects large and small in',
];

const LOCAL_SITUATIONS = [
  'From older housing stock to new-build subdivisions, the slab conditions vary — and we adjust prep and specification based on what we find on arrival.',
  'The housing mix here means we see every kind of substrate, from century-old concrete to recently poured garage slabs. Each gets prep matched to its condition.',
  'Local building eras range from mid-century bungalows to modern custom builds, which is why our quoting process always starts with an in-person slab inspection.',
  'Project types in this area span renovations, new-build finishing, and commercial fit-outs — our scheduling flexes to whichever applies.',
  'Established neighbourhoods, newer developments, and infill projects all generate steady demand for interior finish work here.',
];

const RELIABILITY = [
  'Every job starts with a moisture test and a frank conversation about what the floor needs.',
  'We quote by site visit, not by phone-only estimate — the slab tells us what the system needs.',
  'Prep is where coatings succeed or fail, so we mechanically grind every substrate and never skip to shortcuts.',
  'Our quotes include a written specification: what system, what thickness, what cure time, what warranty.',
  'The crew that quotes is the crew that installs — no bait-and-switch, no sub-contracted finish.',
];

const SCHEDULING = [
  'Lead times vary by season, but we usually book within one to three weeks of the first consult.',
  'We schedule in the order estimates come in, with urgent commercial jobs occasionally jumping the queue.',
  'Most residential jobs are booked within two weeks of quote acceptance.',
  'Commercial projects get phased scheduling if needed to minimize operational downtime.',
];

export function crossPageIntro(service: Service, city: City): string {
  const s = seed(service.slug, city.slug);
  const i = pick(INTROS, s, 0);
  const lead = pick(CITY_LEADS, s, 1);
  return `${i} ${service.name.toLowerCase()} ${lead} ${city.name}.`;
}

export function crossPageParagraphs(service: Service, city: City): string[] {
  const s = seed(service.slug, city.slug);
  const first =
    `${pick(INTROS, s, 2)} ${service.name.toLowerCase()} ${pick(CITY_LEADS, s, 3)} ${city.name}. ` +
    service.tagline + ' ' + city.localContext;

  const local = pick(LOCAL_SITUATIONS, s, 4);
  const reliability = pick(RELIABILITY, s, 5);
  const scheduling = pick(SCHEDULING, s, 6);

  const second =
    `${city.name} sits in the ${city.region} region, and our scheduling runs ${city.drivetime === 'same-day' ? 'same-day for consults' : 'next-day for consults, with same-week installs typical'}. ` +
    `${local} For ${service.shortName.toLowerCase()} specifically, that means ${
      service.features.slice(0, 2).join(', ').toLowerCase()
    }, matched to the actual condition of your slab or wall.`;

  const third = `${reliability} ${scheduling}`;

  return [first, second, third];
}

export function crossPageFaqs(service: Service, city: City): Array<{ q: string; a: string }> {
  const base = service.faqs;
  const cityQuestions: Array<{ q: string; a: string }> = [
    {
      q: `Do you serve all of ${city.name}?`,
      a: `Yes — we work across every neighbourhood in ${city.name}${
        city.neighborhoods.length > 0 ? `, including ${city.neighborhoods.slice(0, 3).join(', ')}` : ''
      }, and surrounding areas. Scheduling is ${city.drivetime === 'same-day' ? 'same-day for consults' : 'next-day'}.`,
    },
    {
      q: `How does ${city.name}'s climate affect ${service.shortName.toLowerCase()}?`,
      a: `The GTA's humidity swings and winter heating cycle affect substrate moisture, which is why we moisture-test every slab before scheduling. ${service.shortName} systems are selected to handle the conditions we find — including the salt and freeze-thaw stress that garage floors see from November through April.`,
    },
    {
      q: `Do you provide quotes in ${city.name}?`,
      a: `Yes — we quote by site visit, usually within a week of first contact. The visit is free, takes about 30 minutes, and ends with a written specification and timeline.`,
    },
  ];
  return [...base.slice(0, 2), ...cityQuestions.slice(0, 2)];
}
