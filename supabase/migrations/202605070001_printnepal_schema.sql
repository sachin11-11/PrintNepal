create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  description text,
  image_url text,
  base_price numeric(12, 2) not null default 0,
  is_featured boolean not null default false,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  size text,
  finish text,
  price_modifier numeric(12, 2) not null default 0,
  description text
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  phone text,
  service_id uuid references public.services(id) on delete set null,
  paper_size text,
  paper_type text,
  quantity integer not null default 1 check (quantity > 0),
  design_method text not null check (design_method in ('uploaded', 'email_design', 'need_design')),
  design_file_url text,
  notes text,
  status text not null default 'received' check (status in ('received', 'designing', 'printing', 'ready', 'delivered', 'cancelled')),
  total_estimate numeric(12, 2),
  created_at timestamp with time zone not null default now()
);

create table if not exists public.order_messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  sender_type text not null check (sender_type in ('customer', 'admin')),
  message text not null,
  created_at timestamp with time zone not null default now()
);

create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists services_slug_idx on public.services (slug);
create index if not exists services_featured_idx on public.services (is_featured);
create index if not exists orders_email_idx on public.orders (email);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_service_id_idx on public.orders (service_id);
create index if not exists order_messages_order_id_idx on public.order_messages (order_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.current_user_email()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    nullif(auth.jwt() ->> 'email', ''),
    (
      select email
      from public.profiles
      where id = auth.uid()
    )
  );
$$;

alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.materials enable row level security;
alter table public.orders enable row level security;
alter table public.order_messages enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid() and role = 'customer');

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles
for insert
to authenticated
with check (id = auth.uid() and role = 'customer');

drop policy if exists "Public can view active services" on public.services;
create policy "Public can view active services"
on public.services
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage services" on public.services;
create policy "Admins can manage services"
on public.services
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can view materials" on public.materials;
create policy "Public can view materials"
on public.materials
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage materials" on public.materials;
create policy "Admins can manage materials"
on public.materials
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Customers can create orders for their email" on public.orders;
create policy "Customers can create orders for their email"
on public.orders
for insert
to authenticated
with check (
  lower(email) = lower(public.current_user_email())
  and status = 'received'
);

drop policy if exists "Customers can view their own orders by email" on public.orders;
create policy "Customers can view their own orders by email"
on public.orders
for select
to authenticated
using (
  lower(email) = lower(public.current_user_email())
  or public.is_admin()
);

drop policy if exists "Admins can update all orders" on public.orders;
create policy "Admins can update all orders"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete orders" on public.orders;
create policy "Admins can delete orders"
on public.orders
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Customers can view messages for their own orders" on public.order_messages;
create policy "Customers can view messages for their own orders"
on public.order_messages
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.orders
    where orders.id = order_messages.order_id
      and lower(orders.email) = lower(public.current_user_email())
  )
);

drop policy if exists "Customers can create messages for their own orders" on public.order_messages;
create policy "Customers can create messages for their own orders"
on public.order_messages
for insert
to authenticated
with check (
  (
    sender_type = 'customer'
    and exists (
      select 1
      from public.orders
      where orders.id = order_messages.order_id
        and lower(orders.email) = lower(public.current_user_email())
    )
  )
  or (
    sender_type = 'admin'
    and public.is_admin()
  )
);

drop policy if exists "Admins can update order messages" on public.order_messages;
create policy "Admins can update order messages"
on public.order_messages
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete order messages" on public.order_messages;
create policy "Admins can delete order messages"
on public.order_messages
for delete
to authenticated
using (public.is_admin());
