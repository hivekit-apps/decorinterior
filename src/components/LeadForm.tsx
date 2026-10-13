'use client';

import { useState } from 'react';
import { getSiteConfig } from '@/lib/config';

type Variant = 'compact' | 'full';

type Props = {
  variant?: Variant;
  defaultService?: string;
  defaultCity?: string;
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function LeadForm({ variant = 'full', defaultService = '', defaultCity = '' }: Props) {
  const cfg = getSiteConfig();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErr, setFieldErr] = useState<string>('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    setFieldErr('');

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      service: String(data.get('service') || '').trim(),
      city: String(data.get('city') || '').trim(),
      message: String(data.get('message') || '').trim(),
      website: String(data.get('website') || ''), // honeypot
      sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(json?.error || 'Something went wrong. Please try calling us.');
        setFieldErr(json?.field || '');
        setStatus('error');
        return;
      }
      setStatus('success');
      form.reset();
    } catch (err) {
      setErrorMsg('Network error. Please try again or call us.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-sm border border-bronze bg-bronze/5 p-5 text-sm">
        <div className="font-semibold text-charcoal mb-1">Thanks — we got your message.</div>
        <div className="text-softgray">
          A confirmation copy has been sent to your email. We&apos;ll reach out shortly to schedule a quote.
          In a hurry? Call us at <a className="underline" href={`tel:${cfg.business.phone}`}>{cfg.business.phoneDisplay}</a>.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      {/* Honeypot */}
      <input type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden="true" className="hidden" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field name="name" label="Name" required error={fieldErr === 'name' ? errorMsg : ''} />
        <Field name="phone" label="Phone" required type="tel" error={fieldErr === 'phone' ? errorMsg : ''} />
      </div>

      <Field name="email" label="Email" type="email" error={fieldErr === 'email' ? errorMsg : ''} />

      {variant === 'full' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SelectField
              name="service"
              label="Service"
              defaultValue={defaultService}
              options={[{ value: '', label: 'Choose a service…' }].concat(
                cfg.services.map((s) => ({ value: s.slug, label: s.name })),
              )}
            />
            <SelectField
              name="city"
              label="City"
              defaultValue={defaultCity}
              options={[{ value: '', label: 'Choose a city…' }].concat(
                cfg.cities.map((c) => ({ value: c.slug, label: c.name })),
              )}
            />
          </div>
          <TextArea name="message" label="Tell us about your project" rows={4} error={fieldErr === 'message' ? errorMsg : ''} />
        </>
      )}

      {variant === 'compact' && (
        <TextArea name="message" label="What are you considering?" rows={3} />
      )}

      {status === 'error' && !fieldErr && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm p-2.5">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Sending…' : 'Request a quote'}
      </button>
      <p className="text-xs text-softgray text-center">
        No spam. We only use your info to reply to this request.
      </p>
    </form>
  );
}

function Field({
  name, label, required, type = 'text', error,
}: { name: string; label: string; required?: boolean; type?: string; error?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-softgray mb-1">
        {label}{required && <span className="text-bronze"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border border-charcoal/20 rounded-sm px-3 py-2 bg-white text-charcoal focus:border-bronze focus:ring-1 focus:ring-bronze outline-none"
      />
      {error && <span className="text-xs text-red-700 mt-1 block">{error}</span>}
    </label>
  );
}

function SelectField({
  name, label, options, defaultValue,
}: { name: string; label: string; options: Array<{ value: string; label: string }>; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-softgray mb-1">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue || ''}
        className="w-full border border-charcoal/20 rounded-sm px-3 py-2 bg-white text-charcoal focus:border-bronze focus:ring-1 focus:ring-bronze outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  name, label, rows = 3, error,
}: { name: string; label: string; rows?: number; error?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-softgray mb-1">{label}</span>
      <textarea
        name={name}
        rows={rows}
        className="w-full border border-charcoal/20 rounded-sm px-3 py-2 bg-white text-charcoal focus:border-bronze focus:ring-1 focus:ring-bronze outline-none"
      />
      {error && <span className="text-xs text-red-700 mt-1 block">{error}</span>}
    </label>
  );
}
