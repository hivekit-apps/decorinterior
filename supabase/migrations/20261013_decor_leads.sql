create table if not exists decor_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  phone text not null,
  email text,
  service_slug text,
  city_slug text,
  message text,
  source_url text,
  user_agent text,
  ip_hash text,
  status text default 'new'
);
create index if not exists idx_decor_leads_created_at on decor_leads(created_at desc);
alter table decor_leads enable row level security;
