// POST /api/leads
//
// Public lead-capture endpoint for Decor Interior. Validates, honeypot-filters,
// rate-limits, persists to Supabase, and sends:
//   (a) notification to LEAD_INBOX_EMAIL (+ cc list)
//   (b) auto-reply to the customer
//
// Env values are sanitized (trailing/wrapping quote artifacts stripped).

import { NextResponse, type NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { sendEmail } from '@/lib/email-send';
import { getSiteConfig } from '@/lib/config';
import { getServiceClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Payload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  service?: unknown;
  city?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
  sourceUrl?: unknown;
};

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || entry.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

function sanitize(v: string | undefined): string {
  if (!v) return '';
  let out = v.trim();
  while (out.startsWith('"') || out.startsWith("'")) out = out.slice(1);
  while (out.endsWith('"') || out.endsWith("'")) out = out.slice(0, -1);
  return out.trim();
}

function asString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Honeypot — silently accept so bots don't retry
  const honeypot = asString(body.website);
  if (honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = asString(body.name);
  const email = asString(body.email);
  const phone = asString(body.phone);
  const serviceSlug = asString(body.service);
  const citySlug = asString(body.city);
  const message = asString(body.message);
  const sourceUrl = asString(body.sourceUrl);

  if (name.length < 2) {
    return NextResponse.json(
      { error: 'Please enter your name (at least 2 characters).', field: 'name' },
      { status: 422 },
    );
  }
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 7) {
    return NextResponse.json(
      { error: 'Please enter a phone number (at least 7 digits).', field: 'phone' },
      { status: 422 },
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.', field: 'email' },
      { status: 422 },
    );
  }

  const cfg = getSiteConfig();
  const now = new Date();
  const timestamp = now.toISOString();

  const serviceObj = cfg.services.find((s) => s.slug === serviceSlug);
  const cityObj = cfg.cities.find((c) => c.slug === citySlug);
  const userAgent = req.headers.get('user-agent') || '';
  const ipHash = hashIp(ip);

  // Persist to Supabase (best-effort — email still sends even if DB write fails)
  const supabase = getServiceClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('decor_leads').insert({
        name,
        phone,
        email: email || null,
        service_slug: serviceSlug || null,
        city_slug: citySlug || null,
        message: message || null,
        source_url: sourceUrl || null,
        user_agent: userAgent,
        ip_hash: ipHash,
      });
      if (error) {
        console.error('[leads] supabase insert error:', error.message);
      }
    } catch (err) {
      console.error('[leads] supabase threw:', err instanceof Error ? err.message : String(err));
    }
  }

  // Build emails
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeMessage = escapeHtml(message || '(no message)');
  const serviceLabel = serviceObj ? serviceObj.name : (serviceSlug ? serviceSlug : '(not specified)');
  const cityLabel = cityObj ? cityObj.name : (citySlug ? citySlug : '(not specified)');
  const safeService = escapeHtml(serviceLabel);
  const safeCity = escapeHtml(cityLabel);
  const safeSource = escapeHtml(sourceUrl);

  const notifyHtml =
    `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:580px;margin:0 auto;padding:24px;color:#111827">` +
    `<div style="border-bottom:3px solid #b8893d;padding-bottom:12px;margin-bottom:16px">` +
    `<p style="font-size:12px;color:#b8893d;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 4px 0;font-weight:600">New lead · Decor Interior</p>` +
    `<p style="font-size:22px;font-weight:700;margin:0;color:#1a1a1a">${safeName}</p>` +
    `</div>` +
    `<table style="font-size:14px;color:#374151;border-collapse:collapse;width:100%;margin:0 0 18px 0">` +
    `<tr><td style="padding:6px 0;color:#6b7280;width:120px"><strong>Phone</strong></td><td style="padding:6px 0"><a href="tel:${safePhone}" style="color:#b8893d">${safePhone}</a></td></tr>` +
    (email ? `<tr><td style="padding:6px 0;color:#6b7280"><strong>Email</strong></td><td style="padding:6px 0"><a href="mailto:${safeEmail}" style="color:#b8893d">${safeEmail}</a></td></tr>` : '') +
    `<tr><td style="padding:6px 0;color:#6b7280"><strong>Service</strong></td><td style="padding:6px 0">${safeService}</td></tr>` +
    `<tr><td style="padding:6px 0;color:#6b7280"><strong>City</strong></td><td style="padding:6px 0">${safeCity}</td></tr>` +
    `<tr><td style="padding:6px 0;color:#6b7280;vertical-align:top"><strong>Message</strong></td><td style="padding:6px 0;white-space:pre-wrap">${safeMessage}</td></tr>` +
    `</table>` +
    `<p style="font-size:12px;color:#9ca3af;margin:16px 0 0 0;border-top:1px solid #e5e7eb;padding-top:10px">Received ${timestamp}${sourceUrl ? ` · from ${safeSource}` : ''}</p>` +
    (email ? `<p style="font-size:13px;color:#4b5563;margin:10px 0 0 0">Reply to this email to respond directly — reply-to is ${safeEmail}.</p>` : '') +
    `</div>`;

  const notifyText =
    `New lead — Decor Interior\n\n` +
    `Name:    ${name}\n` +
    `Phone:   ${phone}\n` +
    (email ? `Email:   ${email}\n` : '') +
    `Service: ${serviceLabel}\n` +
    `City:    ${cityLabel}\n\n` +
    `Message:\n${message || '(no message)'}\n\n` +
    `---\nReceived: ${timestamp}\n` +
    (sourceUrl ? `Source:   ${sourceUrl}\n` : '');

  const notifySubject = `[Decor Interior] ${name} — ${cityLabel} · ${serviceLabel}`;

  // CC list from env
  const ccRaw = sanitize(process.env.LEAD_CC_EMAIL);
  const cc = ccRaw ? ccRaw.split(',').map((s) => s.trim()).filter(Boolean) : [];

  const notifyRes = await sendEmail({
    to: sanitize(process.env.LEAD_INBOX_EMAIL) || cfg.business.email,
    cc,
    replyTo: email || undefined,
    subject: notifySubject,
    html: notifyHtml,
    text: notifyText,
  });
  if (!notifyRes.ok) {
    console.error('[leads] notify send failed:', notifyRes.error);
    return NextResponse.json(
      { ok: false, error: 'Email delivery failed. Please call us at ' + cfg.business.phoneDisplay + '.' },
      { status: 502 },
    );
  }

  // Auto-reply to customer if email supplied — best-effort
  if (email) {
    const firstName = name.split(' ')[0] || name;
    const ackHtml =
      `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827">` +
      `<p style="font-size:12px;color:#b8893d;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 4px 0;font-weight:600">Decor Interior</p>` +
      `<p style="font-size:20px;font-weight:700;margin:0 0 14px 0">Thanks, ${escapeHtml(firstName)}.</p>` +
      `<p style="font-size:15px;line-height:1.55;color:#374151;margin:0 0 14px 0">Thanks for reaching out — we received your request about <strong>${safeService}</strong>${citySlug ? ` in <strong>${safeCity}</strong>` : ''}.</p>` +
      `<p style="font-size:15px;line-height:1.55;color:#374151;margin:0 0 14px 0">We respond same-day during business hours (${escapeHtml(cfg.business.hours)}). If you need us sooner, call <a href="tel:${cfg.business.phone}" style="color:#b8893d">${escapeHtml(cfg.business.phoneDisplay)}</a>.</p>` +
      `<p style="font-size:14px;color:#4b5563;margin:0 0 6px 0"><strong>What you sent:</strong></p>` +
      `<pre style="font-family:ui-monospace,SFMono-Regular,monospace;background:#faf7f2;border-left:3px solid #b8893d;padding:12px;font-size:12px;white-space:pre-wrap;margin:0 0 16px 0;color:#374151">${safeMessage}</pre>` +
      `<p style="font-size:13px;color:#6b7280;margin:16px 0 0 0;border-top:1px solid #e5e7eb;padding-top:12px"><strong>Decor Interior</strong><br/>Sub-brand of ${escapeHtml(cfg.business.parentName)}<br/>${escapeHtml(cfg.business.hours)}<br/><a href="${cfg.business.siteUrl}" style="color:#b8893d">${cfg.business.siteUrl}</a></p>` +
      `</div>`;
    const ackText =
      `Thanks, ${firstName}.\n\n` +
      `Thanks for reaching out to Decor Interior — we received your request about ${serviceLabel}${citySlug ? ` in ${cityLabel}` : ''}.\n\n` +
      `We respond same-day during business hours (${cfg.business.hours}). If you need us sooner, call ${cfg.business.phoneDisplay}.\n\n` +
      `--- Your message ---\n${message || '(no message)'}\n\n` +
      `Decor Interior\nSub-brand of ${cfg.business.parentName}\n${cfg.business.hours}\n${cfg.business.siteUrl}\n`;
    try {
      await sendEmail({
        to: email,
        replyTo: sanitize(process.env.LEAD_INBOX_EMAIL) || cfg.business.email,
        subject: `Thanks — we received your request · Decor Interior`,
        html: ackHtml,
        text: ackText,
      });
    } catch (err) {
      console.warn('[leads] ack send threw:', err instanceof Error ? err.message : String(err));
    }
  }

  return NextResponse.json({ ok: true, message_id: notifyRes.messageId });
}
