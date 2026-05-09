update public.product_templates
set
  thumbnail_url = '/template-images/student-id-card.png',
  template_json = '{
    "version": "1.0",
    "width": 618,
    "height": 936,
    "background": "#ffffff",
    "objects": [
      { "type": "rect", "left": 0, "top": 0, "width": 618, "height": 936, "fill": "#ffffff", "selectable": true },
      { "type": "circle", "left": -172, "top": 220, "radius": 245, "fill": "#1d5a9d", "selectable": true },
      { "type": "circle", "left": -112, "top": 256, "radius": 210, "fill": "#188fc1", "selectable": true },
      { "type": "circle", "left": 302, "top": 555, "radius": 260, "fill": "#1d5a9d", "selectable": true },
      { "type": "rect", "left": 0, "top": 548, "width": 618, "height": 388, "fill": "#1d5a9d", "rx": 0, "ry": 0, "selectable": true },
      { "type": "rect", "left": 0, "top": 548, "width": 326, "height": 388, "fill": "#1d5a9d", "selectable": true },
      { "type": "rect", "left": 0, "top": 548, "width": 280, "height": 200, "fill": "#1f5e9e", "selectable": true },
      { "type": "text", "field": "school_name", "text": "THE ADARSH MODEL", "left": 40, "top": 35, "width": 540, "fontSize": 50, "fontWeight": "bold", "fill": "#e11d48" },
      { "type": "text", "field": "class_department", "text": "HIGH SCHOOL", "left": 42, "top": 96, "width": 320, "fontSize": 34, "fontWeight": "bold", "fill": "#1d5a9d" },
      { "type": "rect", "left": 40, "top": 144, "width": 336, "height": 44, "fill": "#188fc1", "selectable": true },
      { "type": "text", "field": "address", "text": "Gopaldih, Giridih", "left": 54, "top": 150, "width": 305, "fontSize": 31, "fontWeight": "bold", "fill": "#ffffff" },
      { "type": "circle", "left": 418, "top": 120, "radius": 77, "fill": "#ffffff", "stroke": "#e5e7eb", "strokeWidth": 3, "selectable": true },
      { "type": "text", "text": "⬟", "left": 450, "top": 139, "width": 90, "fontSize": 56, "fill": "#22c55e" },
      { "type": "image", "field": "photo", "left": 152, "top": 216, "width": 272, "height": 304 },
      { "type": "rect", "left": 152, "top": 216, "width": 272, "height": 304, "fill": "rgba(235, 174, 182, 0.75)", "rx": 7, "ry": 7, "selectable": false },
      { "type": "text", "field": "student_name", "text": "PRACHI MAHTO", "left": 36, "top": 563, "width": 420, "fontSize": 44, "fontWeight": "bold", "fill": "#ffffff" },
      { "type": "text", "text": "Father Name -", "left": 36, "top": 625, "width": 180, "fontSize": 28, "fontWeight": "bold", "fill": "#fff200" },
      { "type": "text", "field": "guardian_name", "text": "Dinesh Kumar Mahto", "left": 36, "top": 660, "width": 390, "fontSize": 30, "fill": "#ffffff" },
      { "type": "text", "text": "Aadhaar -", "left": 36, "top": 705, "width": 150, "fontSize": 28, "fontWeight": "bold", "fill": "#fff200" },
      { "type": "text", "field": "roll_number", "text": "1234567890", "left": 173, "top": 703, "width": 250, "fontSize": 31, "fill": "#ffffff" },
      { "type": "text", "text": "Roll No. -", "left": 36, "top": 744, "width": 150, "fontSize": 28, "fontWeight": "bold", "fill": "#fff200" },
      { "type": "text", "field": "student_id", "text": "251457", "left": 173, "top": 742, "width": 180, "fontSize": 30, "fontWeight": "bold", "fill": "#ffffff" },
      { "type": "text", "text": "D.O.B. -", "left": 36, "top": 785, "width": 115, "fontSize": 28, "fontWeight": "bold", "fill": "#fff200" },
      { "type": "text", "field": "expiry_date", "text": "06-06-2003", "left": 156, "top": 783, "width": 180, "fontSize": 28, "fontWeight": "bold", "fill": "#ffffff" },
      { "type": "text", "text": "Address -", "left": 36, "top": 824, "width": 145, "fontSize": 28, "fontWeight": "bold", "fill": "#fff200" },
      { "type": "text", "field": "home_address", "text": "Gopaldih, Beko", "left": 174, "top": 823, "width": 270, "fontSize": 28, "fontWeight": "bold", "fill": "#ffffff" },
      { "type": "rect", "left": 84, "top": 873, "width": 246, "height": 42, "fill": "#ffffff", "rx": 21, "ry": 21, "selectable": true },
      { "type": "text", "field": "phone", "text": "☎ 1234567890", "left": 100, "top": 877, "width": 220, "fontSize": 28, "fontWeight": "bold", "fill": "#1d5a9d" },
      { "type": "text", "field": "class_label", "text": "Class - X", "left": 508, "top": 548, "width": 180, "fontSize": 52, "fontWeight": "bold", "fill": "#e0526b", "angle": -90 },
      { "type": "text", "text": "Principal", "left": 486, "top": 894, "width": 120, "fontSize": 22, "fontWeight": "bold", "fill": "#111111" }
    ]
  }'::jsonb,
  editable_fields = '["school_name","class_department","address","student_name","guardian_name","roll_number","student_id","expiry_date","home_address","phone","class_label","photo","color"]'::jsonb,
  updated_at = now()
where slug in ('blue-student-id', 'premium-college-id', 'minimal-white-id', 'green-campus-id', 'red-academy-id');

update public.product_templates
set
  thumbnail_url = '/template-images/wedding card.png',
  template_json = '{
    "version": "1.0",
    "width": 660,
    "height": 976,
    "background": "#ead3aa",
    "objects": [
      { "type": "rect", "left": 104, "top": 88, "width": 455, "height": 780, "fill": "#fbf1e5", "rx": 220, "ry": 220, "selectable": true },
      { "type": "circle", "left": -80, "top": -70, "radius": 138, "fill": "rgba(132, 96, 38, 0.12)", "selectable": true },
      { "type": "circle", "left": 540, "top": 780, "radius": 100, "fill": "rgba(132, 96, 38, 0.10)", "selectable": true },
      { "type": "text", "field": "host_line", "text": "TOGETHER WITH\\nTHEIR FAMILIES", "left": 243, "top": 156, "width": 230, "fontSize": 24, "fontWeight": "bold", "fill": "#8b4a1f" },
      { "type": "text", "field": "bride_name", "text": "Samira", "left": 188, "top": 249, "width": 250, "fontSize": 54, "fontFamily": "Brush Script MT", "fill": "#8b4a1f" },
      { "type": "text", "text": "&", "left": 303, "top": 337, "width": 60, "fontSize": 53, "fontFamily": "Georgia", "fill": "#8b4a1f" },
      { "type": "text", "field": "groom_name", "text": "Richard", "left": 333, "top": 411, "width": 230, "fontSize": 54, "fontFamily": "Brush Script MT", "fill": "#8b4a1f" },
      { "type": "text", "field": "invite_line", "text": "Invite you\\nto their wedding celebration", "left": 205, "top": 481, "width": 260, "fontSize": 24, "fontWeight": "bold", "fill": "#8b4a1f" },
      { "type": "line", "left": 352, "top": 566, "width": 0, "height": 76, "stroke": "#8b4a1f", "strokeWidth": 2 },
      { "type": "text", "text": "▣", "left": 190, "top": 568, "width": 40, "fontSize": 40, "fill": "#8b4a1f" },
      { "type": "text", "field": "event_date", "text": "Wed, Feb 25th, 2024\\nAt 9 am", "left": 146, "top": 615, "width": 180, "fontSize": 20, "fill": "#8b4a1f" },
      { "type": "text", "text": "⌖", "left": 447, "top": 568, "width": 40, "fontSize": 42, "fill": "#8b4a1f" },
      { "type": "text", "field": "venue", "text": "123 Anywhere St.,\\nAny City, ST 12345", "left": 373, "top": 615, "width": 195, "fontSize": 20, "fill": "#8b4a1f" },
      { "type": "text", "field": "footer_line", "text": "Reception to follow", "left": 230, "top": 693, "width": 260, "fontSize": 38, "fontFamily": "Brush Script MT", "fill": "#8b4a1f" },
      { "type": "text", "text": "✿", "left": 452, "top": 85, "width": 120, "fontSize": 96, "fill": "#d7b56f" },
      { "type": "text", "text": "❀", "left": 516, "top": 170, "width": 90, "fontSize": 74, "fill": "#efe1c4" },
      { "type": "text", "text": "✿", "left": 50, "top": 735, "width": 110, "fontSize": 92, "fill": "#efe1c4" },
      { "type": "text", "text": "❀", "left": 126, "top": 772, "width": 100, "fontSize": 78, "fill": "#d7b56f" }
    ]
  }'::jsonb,
  editable_fields = '["host_line","bride_name","groom_name","invite_line","event_date","venue","footer_line","color"]'::jsonb,
  updated_at = now()
where slug in ('blush-floral-invite', 'rustic-kraft-suite', 'greenery-invite-set', 'gold-classic-card', 'modern-minimal-invite');
