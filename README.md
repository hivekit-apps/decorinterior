# Decor Interior

Interior finishes sub-brand of [Decor Coatings](https://decorcoatings.ca) — serving Toronto and the GTA with epoxy flooring, polished concrete, decorative overlays, and architectural interior stucco.

Site: https://decorinterior.ca

## Stack

- Next.js 14 (App Router), TypeScript
- Tailwind CSS
- Supabase (lead persistence)
- Resend (transactional email)
- Deployed on Vercel

## Content

All business content lives in `config/site.json` — services, cities, business info, hours. Edit the JSON, commit, and push to update the live site.

## Dev

```
npm install
npm run dev
```

## Env

See deploy env for the full list. Local dev needs at minimum `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `NEXT_PUBLIC_SITE_URL`.

## Routes

- `/` — Hero + overview
- `/services` + `/services/[slug]` — 11 services
- `/service-areas` + `/service-areas/[slug]` — 23 cities
- `/[service]/[city]` — 253 SEO landing pages (highlighted-city combos prerendered at build; others ISR)
- `/gallery`, `/about`, `/contact`
- `/api/leads` — lead-capture endpoint
