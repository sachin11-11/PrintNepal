create table if not exists public.product_templates (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete cascade,
  title text not null,
  slug text not null unique,
  category text,
  thumbnail_url text,
  template_json jsonb not null default '{}'::jsonb,
  editable_fields jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.orders
add column if not exists selected_template_id uuid references public.product_templates(id) on delete set null,
add column if not exists final_design_url text,
add column if not exists final_design_json jsonb,
add column if not exists customer_lat numeric,
add column if not exists customer_lng numeric,
add column if not exists delivery_distance_km numeric,
add column if not exists estimated_delivery_minutes integer,
add column if not exists estimated_completion_minutes integer,
add column if not exists whatsapp_link text,
add column if not exists payment_status text not null default 'pending'
  check (payment_status in ('pending', 'confirmed', 'paid', 'failed', 'refunded'));

create index if not exists product_templates_service_id_idx on public.product_templates (service_id);
create index if not exists product_templates_slug_idx on public.product_templates (slug);
create index if not exists product_templates_featured_idx on public.product_templates (is_featured);
create index if not exists orders_selected_template_id_idx on public.orders (selected_template_id);
create index if not exists orders_payment_status_idx on public.orders (payment_status);

alter table public.product_templates enable row level security;

drop policy if exists "Public can view product templates" on public.product_templates;
create policy "Public can view product templates"
on public.product_templates
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage product templates" on public.product_templates;
create policy "Admins can manage product templates"
on public.product_templates
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('design-files', 'design-files', false),
  ('final-designs', 'final-designs', true),
  ('template-images', 'template-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can view final designs and templates" on storage.objects;
create policy "Public can view final designs and templates"
on storage.objects
for select
to anon, authenticated
using (bucket_id in ('product-images', 'final-designs', 'template-images'));

drop policy if exists "Authenticated users can upload final designs" on storage.objects;
create policy "Authenticated users can upload final designs"
on storage.objects
for insert
to authenticated
with check (bucket_id in ('design-files', 'final-designs'));

drop policy if exists "Admins can manage template storage" on storage.objects;
create policy "Admins can manage template storage"
on storage.objects
for all
to authenticated
using (bucket_id in ('product-images', 'design-files', 'final-designs', 'template-images') and public.is_admin())
with check (bucket_id in ('product-images', 'design-files', 'final-designs', 'template-images') and public.is_admin());
