type WhatsAppOrderMessage = {
  orderId: string;
  customerName: string;
  productName: string;
  templateName?: string | null;
  quantity: number;
  material?: string | null;
  trackingUrl: string;
  finalDesignUrl?: string | null;
};

export function buildWhatsAppLink(phoneNumber: string | undefined, details: WhatsAppOrderMessage) {
  const cleanNumber = (phoneNumber ?? "").replace(/[^\d]/g, "");

  if (!cleanNumber) {
    return "";
  }

  const lines = [
    "Hello PrintNepal, I placed an order.",
    `Order ID: ${details.orderId}`,
    `Customer: ${details.customerName}`,
    `Product: ${details.productName}`,
    details.templateName ? `Template: ${details.templateName}` : null,
    `Quantity: ${details.quantity}`,
    details.material ? `Material: ${details.material}` : null,
    `Tracking link: ${details.trackingUrl}`,
    details.finalDesignUrl ? `Final design: ${details.finalDesignUrl}` : null,
    "Please confirm design and payment."
  ].filter(Boolean);

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}
