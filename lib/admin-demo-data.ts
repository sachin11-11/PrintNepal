import type { OrderRow, ServiceRow } from "@/types/database";

export type DemoAdminOrder = OrderRow & {
  services?: { title: string } | null;
  product_templates?: { title: string; thumbnail_url: string | null } | null;
  product_designs?: { title: string; image_url: string | null } | null;
};

export const DEMO_ADMIN_SERVICES: ServiceRow[] = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    title: "Student ID Cards",
    slug: "student-id-cards",
    category: "Cards",
    description: "PVC and laminated identity card printing.",
    specifications: "Single or batch ID card production",
    image_url: null,
    base_price: 120,
    is_featured: true,
    created_at: "2026-05-16T08:00:00.000Z"
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    title: "Business Cards",
    slug: "business-cards",
    category: "Business Stationery",
    description: "Premium visiting card print orders.",
    specifications: "350gsm matte or gloss finish",
    image_url: null,
    base_price: 8,
    is_featured: true,
    created_at: "2026-05-16T08:00:00.000Z"
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    title: "Flyers and Posters",
    slug: "flyers-posters",
    category: "Marketing",
    description: "Marketing print jobs for local campaigns.",
    specifications: "A5, A4, A3, and custom sizes",
    image_url: null,
    base_price: 35,
    is_featured: false,
    created_at: "2026-05-16T08:00:00.000Z"
  }
];

const baseOrder = {
  selected_design_id: null,
  final_design_json: null,
  customer_lat: 27.7172,
  customer_lng: 85.324,
    design_file_url: null,
  total_estimate: null
};

export const DEMO_ADMIN_ORDERS: DemoAdminOrder[] = [
  {
    ...baseOrder,
    id: "10000000-0000-4000-8000-000000000001",
    customer_name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+977-9801112233",
    service_id: DEMO_ADMIN_SERVICES[0].id,
    selected_template_id: "generated-student-id-card-01",
    final_design_url: "https://placehold.co/640x1010/png?text=Student+ID+Final",
    delivery_distance_km: 3.2,
    estimated_delivery_minutes: 22,
    estimated_completion_minutes: 60,
    whatsapp_link: "https://wa.me/9779800000000",
    payment_status: "confirmed",
    paper_size: "ID Card",
    paper_type: "PVC",
    quantity: 35,
    design_method: "uploaded",
    notes: "Batch ID cards for grade 10.",
    status: "printing",
    total_estimate: 4200,
    created_at: "2026-05-16T07:45:00.000Z",
    services: { title: "Student ID Cards" },
    product_templates: { title: "Generated Minimal Student ID Card", thumbnail_url: null },
    product_designs: null
  },
  {
    ...baseOrder,
    id: "10000000-0000-4000-8000-000000000002",
    customer_name: "Nisha Thapa",
    email: "nisha.thapa@example.com",
    phone: "+977-9812345678",
    service_id: DEMO_ADMIN_SERVICES[1].id,
    selected_template_id: null,
    final_design_url: null,
    delivery_distance_km: 1.4,
    estimated_delivery_minutes: 14,
    estimated_completion_minutes: 35,
    whatsapp_link: "https://wa.me/9779800000000",
    payment_status: "pending",
    paper_size: "Business card",
    paper_type: "350gsm matte",
    quantity: 500,
    design_method: "need_design",
    notes: "Needs clean consulting brand card.",
    status: "designing",
    total_estimate: 5750,
    created_at: "2026-05-16T06:30:00.000Z",
    services: { title: "Business Cards" },
    product_templates: null,
    product_designs: { title: "Custom upload", image_url: null }
  },
  {
    ...baseOrder,
    id: "10000000-0000-4000-8000-000000000003",
    customer_name: "PrintNepal School",
    email: "school-office@example.com",
    phone: "+977-9844556677",
    service_id: DEMO_ADMIN_SERVICES[0].id,
    selected_template_id: "generated-student-id-card-08",
    final_design_url: "https://placehold.co/640x1010/png?text=Montessori+ID",
    delivery_distance_km: null,
    estimated_delivery_minutes: null,
    estimated_completion_minutes: 90,
    whatsapp_link: null,
    payment_status: "paid",
    paper_size: "ID Card",
    paper_type: "Laminated card",
    quantity: 120,
    design_method: "uploaded",
    notes: "Pickup from shop after print check.",
    status: "ready",
    total_estimate: 14400,
    created_at: "2026-05-15T15:20:00.000Z",
    services: { title: "Student ID Cards" },
    product_templates: { title: "Generated Montessori Student ID Card", thumbnail_url: null },
    product_designs: null
  },
  {
    ...baseOrder,
    id: "10000000-0000-4000-8000-000000000004",
    customer_name: "Kiran Lama",
    email: "kiran.lama@example.com",
    phone: "+977-9860011223",
    service_id: DEMO_ADMIN_SERVICES[2].id,
    selected_template_id: null,
    final_design_url: null,
    delivery_distance_km: 6.8,
    estimated_delivery_minutes: 38,
    estimated_completion_minutes: 75,
    whatsapp_link: "https://wa.me/9779800000000",
    payment_status: "confirmed",
    paper_size: "A4",
    paper_type: "170gsm gloss",
    quantity: 250,
    design_method: "uploaded",
    notes: "Event flyer, needs color proof before final run.",
    status: "received",
    total_estimate: 8750,
    created_at: "2026-05-15T12:10:00.000Z",
    services: { title: "Flyers and Posters" },
    product_templates: null,
    product_designs: null
  },
  {
    ...baseOrder,
    id: "10000000-0000-4000-8000-000000000005",
    customer_name: "Maya Gurung",
    email: "maya.gurung@example.com",
    phone: "+977-9803344556",
    service_id: DEMO_ADMIN_SERVICES[1].id,
    selected_template_id: null,
    final_design_url: "https://placehold.co/1050x600/png?text=Business+Card",
    delivery_distance_km: 4.5,
    estimated_delivery_minutes: 28,
    estimated_completion_minutes: 25,
    whatsapp_link: "https://wa.me/9779800000000",
    payment_status: "paid",
    paper_size: "Business card",
    paper_type: "350gsm gloss",
    quantity: 1000,
    design_method: "uploaded",
    notes: "Urgent delivery before 5 PM.",
    status: "delivered",
    total_estimate: 8000,
    created_at: "2026-05-14T10:05:00.000Z",
    services: { title: "Business Cards" },
    product_templates: null,
    product_designs: { title: "Uploaded design", image_url: null }
  }
];

export function filterDemoAdminOrders(status: string, paymentStatus: string, serviceId: string) {
  return DEMO_ADMIN_ORDERS.filter((order) => {
    if (status !== "all" && order.status !== status) return false;
    if (paymentStatus !== "all" && order.payment_status !== paymentStatus) return false;
    if (serviceId !== "all" && order.service_id !== serviceId) return false;
    return true;
  });
}
