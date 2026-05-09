create table if not exists public.product_designs (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete cascade,
  title text not null,
  category text,
  description text,
  image_url text,
  price numeric(12, 2) not null default 0,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now()
);

alter table public.orders
add column if not exists selected_design_id uuid references public.product_designs(id) on delete set null;

create index if not exists product_designs_service_id_idx on public.product_designs (service_id);
create index if not exists product_designs_active_idx on public.product_designs (is_active);

alter table public.product_designs enable row level security;

drop policy if exists "Public can view active product designs" on public.product_designs;
create policy "Public can view active product designs"
on public.product_designs
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can manage product designs" on public.product_designs;
create policy "Admins can manage product designs"
on public.product_designs
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
