insert into public.services (title, slug, category, description, image_url, base_price, is_featured)
values
  (
    'ID cards',
    'id-cards',
    'Business',
    'Employee ID cards, student cards, visitor badges, and lanyard-ready cards.',
    'https://images.unsplash.com/photo-1622556498246-755f44ca76f3?auto=format&fit=crop&w=1400&q=80',
    120,
    true
  )
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  description = excluded.description,
  image_url = excluded.image_url,
  base_price = excluded.base_price,
  is_featured = excluded.is_featured;

update public.services
set image_url = 'https://images.pexels.com/photos/29821871/pexels-photo-29821871.jpeg?auto=compress&cs=tinysrgb&w=1400'
where slug = 'wedding-catalogs-cards';

insert into public.product_designs (service_id, title, category, description, image_url, price, is_active)
select services.id, design.title, design.category, design.description, design.image_url, design.price, true
from public.services
join (
  values
    (
      'wedding-catalogs-cards',
      'Blush Floral Wedding Invite',
      'Wedding card',
      'Printed floral invitation cards with matching detail card and envelope-ready layout.',
      'https://images.pexels.com/photos/29821871/pexels-photo-29821871.jpeg?auto=compress&cs=tinysrgb&w=1200',
      65::numeric
    ),
    (
      'wedding-catalogs-cards',
      'Rustic Kraft Invitation Suite',
      'Wedding card',
      'Rustic printed invitation suite with RSVP card styling and warm kraft-paper presentation.',
      'https://images.pexels.com/photos/29395419/pexels-photo-29395419.jpeg?auto=compress&cs=tinysrgb&w=1200',
      75::numeric
    ),
    (
      'wedding-catalogs-cards',
      'Greenery Wedding Card Set',
      'Wedding card',
      'Botanical wedding invitation design with greenery accents and clean premium card layout.',
      'https://images.pexels.com/photos/29821868/pexels-photo-29821868.jpeg?auto=compress&cs=tinysrgb&w=1200',
      70::numeric
    ),
    (
      'id-cards',
      'Corporate Staff ID',
      'ID card',
      'Professional staff ID card layout with portrait, role, QR field, and lanyard-ready finish.',
      'https://images.unsplash.com/photo-1622556498246-755f44ca76f3?auto=format&fit=crop&w=1200&q=80',
      120::numeric
    ),
    (
      'id-cards',
      'Student ID Badge',
      'ID card',
      'Student badge card design with photo area, ID number, program line, and laminated finish.',
      'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80',
      90::numeric
    )
) as design(slug, title, category, description, image_url, price)
on services.slug = design.slug
where not exists (
  select 1
  from public.product_designs
  where product_designs.service_id = services.id
    and product_designs.title = design.title
);
