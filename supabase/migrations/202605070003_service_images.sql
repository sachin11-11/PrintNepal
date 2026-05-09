update public.services
set image_url = case slug
  when 'wedding-catalogs-cards' then '/images/services/wedding-catalogs-cards.svg'
  when 'custom-stickers' then '/images/services/custom-stickers.svg'
  when 'laptop-wrappers' then '/images/services/laptop-wrappers.svg'
  when 'business-essentials' then '/images/services/business-essentials.svg'
  when 'architectural-blueprints' then '/images/services/architectural-blueprints.svg'
  when 'fine-art-prints' then '/images/services/fine-art-prints.svg'
  when 'business-cards' then '/images/services/business-cards.svg'
  when 'custom-t-shirts' then '/images/services/custom-t-shirts.svg'
  when 'yard-signs' then '/images/services/yard-signs.svg'
  when 'drinkware' then '/images/services/drinkware.svg'
  when 'silver-sparkle-paper-printing' then '/images/services/silver-sparkle-paper-printing.svg'
  when 'stitch-binding' then '/images/services/stitch-binding.svg'
  else image_url
end;
