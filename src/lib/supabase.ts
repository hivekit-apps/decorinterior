import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function sanitize(v: string | undefined): string {
  if (!v) return '';
  let out = v.trim();
  while (out.startsWith('"') || out.startsWith("'")) out = out.slice(1);
  while (out.endsWith('"') || out.endsWith("'")) out = out.slice(0, -1);
  return out.trim();
}

export function getServiceClient(): SupabaseClient | null {
  const url = sanitize(process.env.SUPABASE_URL) || sanitize(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = sanitize(process.env.SUPABASE_SERVICE_KEY);
  if (!url || !key) {
    console.warn('[supabase] SUPABASE_URL or SUPABASE_SERVICE_KEY missing — lead persistence disabled');
    return null;
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
