update public.product_templates
set
  template_json = '{
    "version": "1.0",
    "width": 618,
    "height": 936,
    "background": "#ffffff",
    "objects": [
      { "type": "rect", "left": 0, "top": 0, "width": 618, "height": 936, "fill": "#ffffff", "selectable": true },
      { "type": "circle", "left": -176, "top": 212, "radius": 248, "fill": "#1d5a9d", "selectable": true },
      { "type": "circle", "left": -112, "top": 250, "radius": 210, "fill": "#188fc1", "selectable": true },
      { "type": "circle", "left": 296, "top": 554, "radius": 258, "fill": "#1d5a9d", "selectable": true },
      { "type": "rect", "left": 0, "top": 548, "width": 618, "height": 388, "fill": "#1d5a9d", "selectable": true },
      { "type": "rect", "left": 40, "top": 34, "width": 540, "height": 54, "fill": "transparent", "selectable": true },
      { "type": "text", "field": "school_name", "text": "THE ADARSH MODEL", "left": 40, "top": 35, "width": 540, "fontSize": 50, "fontWeight": "bold", "fill": "#e11d48" },
      { "type": "text", "field": "class_department", "text": "HIGH SCHOOL", "left": 42, "top": 96, "width": 320, "fontSize": 34, "fontWeight": "bold", "fill": "#1d5a9d" },
      { "type": "rect", "left": 40, "top": 145, "width": 334, "height": 42, "fill": "#188fc1", "selectable": true },
      { "type": "text", "field": "address", "text": "Gopaldih, Giridih", "left": 54, "top": 150, "width": 304, "fontSize": 30, "fontWeight": "bold", "fill": "#ffffff" },
      { "type": "circle", "left": 416, "top": 120, "radius": 78, "fill": "#ffffff", "stroke": "#e5e7eb", "strokeWidth": 3, "selectable": true },
      { "type": "text", "text": "⬟", "left": 451, "top": 138, "width": 90, "fontSize": 56, "fill": "#22c55e" },
      { "type": "rect", "left": 150, "top": 218, "width": 276, "height": 300, "fill": "#ebb0b6", "rx": 8, "ry": 8, "selectable": true },
      { "type": "image", "field": "photo", "left": 152, "top": 216, "width": 272, "height": 304 },
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
where slug in ('blue-student-id', 'green-campus-id', 'minimal-white-id', 'red-academy-id', 'premium-college-id');

update public.product_templates
set
  template_json = '{
    "version": "1.0",
    "width": 660,
    "height": 976,
    "background": "#ead3aa",
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
  editable_fields = '["host_line","bride_name","groom_name","invite_line","event_date","venue","footer_line","invitation_image","couple_photo","color"]'::jsonb,
  updated_at = now()
where slug in ('blush-floral-invite', 'rustic-kraft-suite', 'greenery-invite-set', 'gold-classic-card', 'modern-minimal-invite');
