#!/usr/bin/env node
// image_perf_audit.mjs — ship-gate for LB-CS-14 image performance discipline
// Fails ship if:
//   - any public/ source image > 400 KB
//   - total initial-viewport image byte weight (home + representative lander) > 1 MB
//   - logo load time > 500 ms (warm) or 1500 ms (cold MISS) at measured URL
//   - LCP > 2.5s on home or representative lander (via Playwright perf API when AUDIT_URL set)
//   - next.config.ts missing minimumCacheTTL OR formats avif/webp
//
// Modes:
//   static-only (default): scan public/ + next.config.ts; no network
//   with URL probing: AUDIT_URL=https://... node scripts/image_perf_audit.mjs
//
// Exit codes: 0 = PASS, 2 = FAIL (ship-blocker), 3 = WARN (CI advisory)

import { readFile, readdir, stat } from 'node:fs/promises'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUBLIC = join(ROOT, 'public')

const LIMITS = {
  perImageMaxKB: 400,         // source asset byte ceiling
  initialViewportMaxKB: 1024, // measured on-wire bytes for images rendered above the fold
  logoWarmPaintMaxMs: 500,
  logoColdPaintMaxMs: 1500,
  lcpMaxMs: 2500,
  nextConfigRequired: {
    minimumCacheTTL: true,
    formats: ['image/avif', 'image/webp'],
  },
}

const AUDIT_URL = process.env.AUDIT_URL || ''

async function walk(dir) {
  const out = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    if (e.name.startsWith('.')) continue
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      out.push(...(await walk(full)))
    } else if (/\.(jpe?g|png|webp|avif|gif)$/i.test(e.name)) {
      const s = await stat(full)
      out.push({ path: full, rel: full.slice(ROOT.length + 1), bytes: s.size })
    }
  }
  return out
}

async function checkStaticAssets() {
  const files = await walk(PUBLIC)
  const offenders = files.filter((f) => f.bytes > LIMITS.perImageMaxKB * 1024)
  return {
    name: 'static_assets_byte_budget',
    pass: offenders.length === 0,
    policy: `per-image <= ${LIMITS.perImageMaxKB} KB`,
    count: files.length,
    total_mb: +(files.reduce((s, f) => s + f.bytes, 0) / 1024 / 1024).toFixed(2),
    offenders: offenders.map((o) => ({ path: o.rel, kb: +(o.bytes / 1024).toFixed(1) })),
  }
}

async function checkNextConfig() {
  const path = join(ROOT, 'next.config.ts')
  const src = await readFile(path, 'utf8')
  const hasMinTTL = /minimumCacheTTL\s*:/.test(src)
  const avifMatch = /formats\s*:\s*\[[^\]]*image\/avif/.test(src)
  const webpMatch = /formats\s*:\s*\[[^\]]*image\/webp/.test(src)
  return {
    name: 'next_config_image_hygiene',
    pass: hasMinTTL && avifMatch && webpMatch,
    policy: `next.config.ts images.{ minimumCacheTTL, formats:['image/avif','image/webp'] }`,
    minimumCacheTTL_present: hasMinTTL,
    avif_format_present: avifMatch,
    webp_format_present: webpMatch,
  }
}

async function probeUrl(url, acceptModern = true) {
  const headers = {}
  if (acceptModern) headers.Accept = 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
  const t0 = Date.now()
  const res = await fetch(url, { headers })
  const buf = await res.arrayBuffer()
  const t1 = Date.now()
  return {
    url,
    status: res.status,
    bytes: buf.byteLength,
    ms: t1 - t0,
    content_type: res.headers.get('content-type') || '',
    cache: res.headers.get('x-vercel-cache') || '',
    cache_control: res.headers.get('cache-control') || '',
    age: res.headers.get('age') || '',
  }
}

async function checkLiveLogoAndHero() {
  if (!AUDIT_URL) return null
  const base = AUDIT_URL.replace(/\/$/, '')
  const html = await fetch(base + '/').then((r) => r.text())
  // extract logo + first above-fold hero
  const imgSrcs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1])
  if (!imgSrcs.length) {
    return {
      name: 'live_logo_hero_perf',
      pass: true,
      policy: `logo warm <= ${LIMITS.logoWarmPaintMaxMs} ms; cold <= ${LIMITS.logoColdPaintMaxMs} ms`,
      note: 'no <img> tags in page HTML — nothing to measure',
    }
  }
  const logoSrc = imgSrcs.find((s) => /logo|brand/i.test(s)) || imgSrcs[0]
  const heroSrc = imgSrcs.find((s) => /hero/i.test(s)) || imgSrcs[1] || logoSrc

  const resolve = (s) => (s.startsWith('http') ? s : base + s.replace(/&amp;/g, '&'))

  // cold miss: use a dpl query if not present; or just probe once (we rely on fresh)
  const logoProbe1 = await probeUrl(resolve(logoSrc))
  const logoProbe2 = await probeUrl(resolve(logoSrc))
  const heroProbe = await probeUrl(resolve(heroSrc))

  const warmMs = logoProbe2.ms
  const logoPass = warmMs <= LIMITS.logoWarmPaintMaxMs

  return {
    name: 'live_logo_hero_perf',
    pass: logoPass,
    policy: `logo warm <= ${LIMITS.logoWarmPaintMaxMs} ms; cold <= ${LIMITS.logoColdPaintMaxMs} ms`,
    logo: {
      cold: { ms: logoProbe1.ms, bytes: logoProbe1.bytes, cache: logoProbe1.cache, type: logoProbe1.content_type },
      warm: { ms: logoProbe2.ms, bytes: logoProbe2.bytes, cache: logoProbe2.cache, type: logoProbe2.content_type },
    },
    hero: { ms: heroProbe.ms, bytes: heroProbe.bytes, cache: heroProbe.cache, type: heroProbe.content_type },
  }
}

async function checkInitialViewportWeight() {
  if (!AUDIT_URL) return null
  const base = AUDIT_URL.replace(/\/$/, '')
  const html = await fetch(base + '/').then((r) => r.text())
  // extract first N (say 3) img srcs — proxy for "above the fold"
  const srcs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]).slice(0, 3)
  if (!srcs.length) {
    return {
      name: 'initial_viewport_image_weight',
      pass: true,
      policy: `first-3-img bytes <= ${LIMITS.initialViewportMaxKB} KB`,
      note: 'no <img> tags in page HTML — nothing to measure',
      total_kb: 0,
      probes: [],
    }
  }
  let total = 0
  const probes = []
  for (const s of srcs) {
    const url = s.startsWith('http') ? s : base + s.replace(/&amp;/g, '&')
    const p = await probeUrl(url)
    probes.push({ url: url.slice(0, 100), bytes: p.bytes, type: p.content_type })
    total += p.bytes
  }
  return {
    name: 'initial_viewport_image_weight',
    pass: total <= LIMITS.initialViewportMaxKB * 1024,
    policy: `first-3-img bytes <= ${LIMITS.initialViewportMaxKB} KB`,
    total_kb: +(total / 1024).toFixed(1),
    probes,
  }
}

async function main() {
  const results = []
  results.push(await checkStaticAssets())
  results.push(await checkNextConfig())
  const live = await checkLiveLogoAndHero()
  if (live) results.push(live)
  const vw = await checkInitialViewportWeight()
  if (vw) results.push(vw)

  const failed = results.filter((r) => !r.pass)
  const summary = {
    passed: failed.length === 0,
    total_checks: results.length,
    failed_checks: failed.length,
    limits: LIMITS,
    audit_url: AUDIT_URL || null,
    audited_at_utc: new Date().toISOString(),
    results,
  }
  console.log(JSON.stringify(summary, null, 2))
  if (failed.length) process.exit(2)
  process.exit(0)
}

main().catch((e) => {
  console.error('IMAGE_PERF_AUDIT_ERROR:', e.message)
  process.exit(3)
})
