update public.product_templates
set
  template_json = '{
    "version": "1.0",
    "width": 660,
    "height": 976,
    "background": "#f7edf3",
    "objects": [
      { "type": "rect", "left": 0, "top": 0, "width": 660, "height": 976, "fill": "#ead3aa", "selectable": true },
      { "type": "circle", "left": -84, "top": -54, "radius": 190, "fill": "rgba(227, 200, 145, 0.40)", "selectable": true },
      { "type": "circle", "left": 520, "top": 796, "radius": 120, "fill": "rgba(227, 200, 145, 0.32)", "selectable": true },
      { "type": "rect", "left": 74, "top": 80, "width": 512, "height": 816, "fill": "#f7eddc", "rx": 220, "ry": 220, "selectable": true },
      { "type": "rect", "left": 74, "top": 80, "width": 512, "height": 816, "fill": "#f8f0e1", "rx": 220, "ry": 220, "selectable": true },
      { "type": "rect", "left": 74, "top": 80, "width": 512, "height": 816, "fill": "rgba(255,255,255,0.75)", "rx": 220, "ry": 220, "selectable": true },
      { "type": "text", "field": "host_line", "text": "TOGETHER WITH\\nTHEIR FAMILIES", "left": 188, "top": 146, "width": 284, "fontSize": 24, "fontFamily": "Georgia", "fontWeight": "bold", "textAlign": "center", "fill": "#a06a31" },
      { "type": "text", "field": "bride_name", "text": "Samira", "left": 168, "top": 244, "width": 320, "fontSize": 56, "fontFamily": "Brush Script MT", "textAlign": "center", "fill": "#a06a31" },
      { "type": "text", "text": "&", "left": 300, "top": 330, "width": 60, "fontSize": 52, "fontFamily": "Georgia", "textAlign": "center", "fill": "#a06a31" },
      { "type": "text", "field": "groom_name", "text": "Richard", "left": 310, "top": 398, "width": 260, "fontSize": 56, "fontFamily": "Brush Script MT", "textAlign": "center", "fill": "#a06a31" },
      { "type": "text", "field": "invite_line", "text": "Invite you\\nto their wedding celebration", "left": 172, "top": 489, "width": 316, "fontSize": 24, "fontFamily": "Georgia", "textAlign": "center", "fill": "#a06a31" },
      { "type": "line", "left": 352, "top": 560, "width": 0, "height": 82, "stroke": "#a06a31", "strokeWidth": 3 },
      { "type": "text", "text": "⌛", "left": 168, "top": 560, "width": 48, "fontSize": 38, "fill": "#a06a31" },
      { "type": "text", "field": "event_date", "text": "Wed, Feb 25th, 2024\\nAt 9 am", "left": 136, "top": 615, "width": 184, "fontSize": 21, "fontFamily": "Georgia", "textAlign": "center", "fill": "#a06a31" },
      { "type": "text", "text": "⌖", "left": 452, "top": 558, "width": 40, "fontSize": 42, "fill": "#a06a31" },
      { "type": "text", "field": "venue", "text": "123 Anywhere St.,\\nAny City, ST 12345", "left": 386, "top": 615, "width": 180, "fontSize": 21, "fontFamily": "Georgia", "textAlign": "center", "fill": "#a06a31" },
      { "type": "text", "field": "footer_line", "text": "Reception to follow", "left": 230, "top": 692, "width": 260, "fontSize": 36, "fontFamily": "Brush Script MT", "textAlign": "center", "fill": "#a06a31" },
      { "type": "image", "field": "invitation_image", "left": 462, "top": 70, "width": 150, "height": 260 },
      { "type": "image", "field": "couple_photo", "left": 28, "top": 760, "width": 180, "height": 170 },
      { "type": "text", "text": "✿", "left": 54, "top": 742, "width": 80, "fontSize": 80, "fill": "#d7b56f" },
      { "type": "text", "text": "❀", "left": 108, "top": 784, "width": 72, "fontSize": 64, "fill": "#f0e3c7" },
      { "type": "text", "text": "✿", "left": 500, "top": 92, "width": 90, "fontSize": 88, "fill": "#d7b56f" },
      { "type": "text", "text": "❀", "left": 546, "top": 160, "width": 70, "fontSize": 66, "fill": "#f0e3c7" }
    ]
  }'::jsonb,
  editable_fields = '["template_title","host_line","bride_name","groom_name","event_date","phone","roll_number","venue","details","invitation_image","couple_photo","color"]'::jsonb,
  updated_at = now()
where lower(coalesce(category, '')) like '%wedding%'
   or slug in ('blush-floral-invite', 'rustic-kraft-suite', 'greenery-invite-set', 'gold-classic-card', 'modern-minimal-invite');
