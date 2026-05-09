with service_seed(title, slug, category, description, image_url, base_price, is_featured) as (
  values
    ('Student ID cards', 'student-id-cards', 'ID cards', 'Student ID card templates with editable school, student, photo, roll number, and contact fields.', 'https://images.unsplash.com/photo-1622556498246-755f44ca76f3?auto=format&fit=crop&w=1400&q=80', 120::numeric, true),
    ('Wedding catalogs/cards', 'wedding-catalogs-cards', 'Events', 'Premium invitations, catalogs, RSVP cards, envelopes, and keepsakes.', 'https://images.pexels.com/photos/29821871/pexels-photo-29821871.jpeg?auto=compress&cs=tinysrgb&w=1400', 35::numeric, true),
    ('Business cards', 'business-cards', 'Business', 'Sharp business cards with premium paper and finishing options.', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1400&q=80', 499::numeric, false),
    ('Custom stickers', 'custom-stickers', 'Branding', 'Die-cut stickers, labels, seals, packaging marks, and sticker sheets.', 'https://images.unsplash.com/photo-1619468129361-605ebea04b44?auto=format&fit=crop&w=1400&q=80', 8::numeric, false)
)
insert into public.services (title, slug, category, description, image_url, base_price, is_featured)
select * from service_seed
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  description = excluded.description,
  image_url = excluded.image_url,
  base_price = excluded.base_price,
  is_featured = excluded.is_featured;

with template_seed(service_slug, title, slug, category, thumbnail_url, accent, editable_fields) as (
  values
    ('student-id-cards','Blue Student ID','blue-student-id','Student ID','https://images.unsplash.com/photo-1622556498246-755f44ca76f3?auto=format&fit=crop&w=1000&q=80','#1d4ed8','["student_name","photo","school_name","class_department","roll_number","phone","address","blood_group","expiry_date","color"]'::jsonb),
    ('student-id-cards','Green Campus ID','green-campus-id','Student ID','https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1000&q=80','#15803d','["student_name","photo","school_name","class_department","roll_number","phone","address","blood_group","expiry_date","color"]'::jsonb),
    ('student-id-cards','Minimal White ID','minimal-white-id','Student ID','https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=1000&q=80','#111827','["student_name","photo","school_name","class_department","roll_number","phone","address","blood_group","expiry_date","color"]'::jsonb),
    ('student-id-cards','Red Academy ID','red-academy-id','Student ID','https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80','#b91c1c','["student_name","photo","school_name","class_department","roll_number","phone","address","blood_group","expiry_date","color"]'::jsonb),
    ('student-id-cards','Premium College ID','premium-college-id','Student ID','https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80','#7c3aed','["student_name","photo","school_name","class_department","roll_number","phone","address","blood_group","expiry_date","color"]'::jsonb),
    ('wedding-catalogs-cards','Blush Floral Invite','blush-floral-invite','Wedding card','https://images.pexels.com/photos/29821871/pexels-photo-29821871.jpeg?auto=compress&cs=tinysrgb&w=1000','#be185d','["bride_name","groom_name","event_date","venue","address","phone","color"]'::jsonb),
    ('wedding-catalogs-cards','Rustic Kraft Suite','rustic-kraft-suite','Wedding card','https://images.pexels.com/photos/29395419/pexels-photo-29395419.jpeg?auto=compress&cs=tinysrgb&w=1000','#92400e','["bride_name","groom_name","event_date","venue","address","phone","color"]'::jsonb),
    ('wedding-catalogs-cards','Greenery Invite Set','greenery-invite-set','Wedding card','https://images.pexels.com/photos/29821868/pexels-photo-29821868.jpeg?auto=compress&cs=tinysrgb&w=1000','#15803d','["bride_name","groom_name","event_date","venue","address","phone","color"]'::jsonb),
    ('wedding-catalogs-cards','Gold Classic Card','gold-classic-card','Wedding card','https://images.pexels.com/photos/2959192/pexels-photo-2959192.jpeg?auto=compress&cs=tinysrgb&w=1000','#a16207','["bride_name","groom_name","event_date","venue","address","phone","color"]'::jsonb),
    ('wedding-catalogs-cards','Modern Minimal Invite','modern-minimal-invite','Wedding card','https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=1000','#334155','["bride_name","groom_name","event_date","venue","address","phone","color"]'::jsonb),
    ('business-cards','Black Studio Card','black-studio-card','Business card','https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=1000&q=80','#111827','["full_name","company_name","job_title","phone","email","address","logo","color"]'::jsonb),
    ('business-cards','Blue Corporate Card','blue-corporate-card','Business card','https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=1000&q=80','#1d4ed8','["full_name","company_name","job_title","phone","email","address","logo","color"]'::jsonb),
    ('business-cards','Creative Vertical Card','creative-vertical-card','Business card','https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1000&q=80','#db2777','["full_name","company_name","job_title","phone","email","address","logo","color"]'::jsonb),
    ('business-cards','Minimal Consultant Card','minimal-consultant-card','Business card','https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80','#475569','["full_name","company_name","job_title","phone","email","address","logo","color"]'::jsonb),
    ('business-cards','Luxury Gold Card','luxury-gold-card','Business card','https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80','#a16207','["full_name","company_name","job_title","phone","email","address","logo","color"]'::jsonb),
    ('custom-stickers','Round Cafe Sticker','round-cafe-sticker','Sticker','https://images.unsplash.com/photo-1619468129361-605ebea04b44?auto=format&fit=crop&w=1000&q=80','#78350f','["brand_name","tagline","logo","phone","color"]'::jsonb),
    ('custom-stickers','Product Label Sticker','product-label-sticker','Sticker','https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1000&q=80','#047857','["brand_name","tagline","logo","phone","color"]'::jsonb),
    ('custom-stickers','Die Cut Creator Sticker','die-cut-creator-sticker','Sticker','https://images.unsplash.com/photo-1598532213005-0033750b6d61?auto=format&fit=crop&w=1000&q=80','#7c3aed','["brand_name","tagline","logo","phone","color"]'::jsonb),
    ('custom-stickers','Thank You Seal','thank-you-seal','Sticker','https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=1000&q=80','#be185d','["brand_name","tagline","logo","phone","color"]'::jsonb),
    ('custom-stickers','Minimal Brand Mark','minimal-brand-mark','Sticker','https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=1000&q=80','#111827','["brand_name","tagline","logo","phone","color"]'::jsonb)
)
insert into public.product_templates (service_id, title, slug, category, thumbnail_url, template_json, editable_fields, is_featured)
select
  services.id,
  template_seed.title,
  template_seed.slug,
  template_seed.category,
  template_seed.thumbnail_url,
  jsonb_build_object(
    'version','1.0',
    'width',640,
    'height',400,
    'background','#ffffff',
    'accent',template_seed.accent,
    'objects', jsonb_build_array(
      jsonb_build_object('type','rect','left',0,'top',0,'width',640,'height',96,'fill',template_seed.accent,'selectable',false),
      jsonb_build_object('type','text','field','school_name','text',case when template_seed.category = 'Student ID' then 'School / College Name' when template_seed.category = 'Wedding card' then 'Wedding Invitation' when template_seed.category = 'Business card' then 'Company Name' else 'Brand Name' end,'left',32,'top',28,'fontSize',28,'fill','#ffffff','fontWeight','bold'),
      jsonb_build_object('type','text','field','student_name','text',case when template_seed.category = 'Student ID' then 'Student Name' when template_seed.category = 'Wedding card' then 'Bride & Groom' when template_seed.category = 'Business card' then 'Full Name' else 'Sticker Title' end,'left',32,'top',145,'fontSize',34,'fill','#111111','fontWeight','bold'),
      jsonb_build_object('type','image','field','photo','left',430,'top',126,'width',150,'height',150,'src',template_seed.thumbnail_url),
      jsonb_build_object('type','text','field','roll_number','text','Roll / Phone / Date','left',32,'top',205,'fontSize',20,'fill','#444444'),
      jsonb_build_object('type','text','field','address','text','Address / Venue / Details','left',32,'top',245,'fontSize',18,'fill','#555555')
    )
  ),
  template_seed.editable_fields,
  true
from template_seed
join public.services on services.slug = template_seed.service_slug
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  thumbnail_url = excluded.thumbnail_url,
  template_json = excluded.template_json,
  editable_fields = excluded.editable_fields,
  is_featured = excluded.is_featured,
  updated_at = now();
