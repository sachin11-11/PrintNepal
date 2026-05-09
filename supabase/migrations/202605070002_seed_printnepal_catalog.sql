insert into public.services (title, slug, category, description, image_url, base_price, is_featured)
values
  ('Wedding catalogs/cards', 'wedding-catalogs-cards', 'Events', 'Premium wedding cards, catalogs, invitations, envelopes, and ceremony print sets.', null, 35, true),
  ('Custom stickers', 'custom-stickers', 'Branding', 'Die-cut stickers, labels, seals, packaging marks, and sticker sheets.', null, 8, true),
  ('Laptop wrappers', 'laptop-wrappers', 'Custom', 'Durable custom laptop wrappers and skins with laminated matte or gloss finishes.', null, 699, true),
  ('Business essentials', 'business-essentials', 'Business', 'Letterheads, folders, invoices, envelopes, and daily business print kits.', null, 1499, false),
  ('Architectural blueprints', 'architectural-blueprints', 'Large Format', 'Large-format architectural blueprints, site plans, drawings, and revision sets.', null, 120, false),
  ('Fine art prints', 'fine-art-prints', 'Art', 'Gallery-grade color prints for artists, photographers, and design studios.', null, 350, false),
  ('Business cards', 'business-cards', 'Business', 'Premium business cards with clean paper stocks and finishing options.', null, 499, true),
  ('Custom T-shirts', 'custom-t-shirts', 'Apparel', 'Small-batch custom T-shirt printing for teams, brands, and events.', null, 799, true),
  ('Yard signs', 'yard-signs', 'Signage', 'Weather-ready yard signs for campaigns, properties, and local promotions.', null, 650, false),
  ('Drinkware', 'drinkware', 'Merch', 'Custom mugs, bottles, and branded drinkware for gifts and business merchandise.', null, 450, false),
  ('Silver sparkle paper printing', 'silver-sparkle-paper-printing', 'Specialty', 'Silver sparkle paper printing for premium cards, certificates, invitations, and catalogs.', null, 55, true),
  ('Stitch binding', 'stitch-binding', 'Finishing', 'Elegant stitch binding for booklets, portfolios, menus, reports, and catalogs.', null, 180, false)
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  description = excluded.description,
  image_url = excluded.image_url,
  base_price = excluded.base_price,
  is_featured = excluded.is_featured;

insert into public.materials (name, type, size, finish, price_modifier, description)
values
  ('Silver Sparkle', 'Specialty paper', 'A4, A5, custom card sizes', 'Sparkle', 25, 'Reflective silver sparkle stock for wedding cards, invitations, certificates, and premium catalogs.'),
  ('Matte Vinyl', 'Sticker vinyl', 'Custom cut', 'Matte laminate', 15, 'Soft-touch vinyl for stickers, labels, laptop wrappers, and packaging.'),
  ('300gsm Cardstock', 'Card paper', 'A4, A5, business card', 'Smooth matte', 10, 'Heavy cardstock for business cards, postcards, wedding cards, and brand essentials.'),
  ('Linen Texture', 'Textured paper', 'A4, A5, invitation sizes', 'Linen', 18, 'Elegant textured paper for wedding catalogs, cards, menus, and formal stationery.'),
  ('Pearl Paper', 'Specialty paper', 'Invitation sizes', 'Pearl shimmer', 22, 'Soft pearlescent stock for premium event stationery.'),
  ('Archival Matte', 'Fine art paper', 'A4, A3, custom art sizes', 'Matte', 35, 'Museum-style matte paper for fine art prints and photography editions.'),
  ('Gloss Vinyl', 'Sticker vinyl', 'Custom cut', 'Gloss laminate', 15, 'High-impact sticker and wrapper vinyl with a polished finish.'),
  ('Bond Blueprint Paper', 'Large format paper', 'A2, A1, A0', 'Technical matte', 0, 'Clean large-format paper for architectural blueprints and site plans.');
