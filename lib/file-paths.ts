export function safeFileSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "file";
}

export function orderFileFolder(orderId: string, customerName: string) {
  return `orders/${orderId}/customer-${safeFileSegment(customerName)}`;
}

export function customerUploadPath(orderId: string, customerName: string, fileName: string) {
  const extension = fileName.includes(".") ? fileName.split(".").pop() || "upload" : "upload";
  const baseName = fileName.replace(/\.[^.]+$/, "");
  return `${orderFileFolder(orderId, customerName)}/customer-upload/${Date.now()}-${safeFileSegment(baseName)}.${safeFileSegment(extension)}`;
}

export function finalPdfPath(orderId: string, customerName: string, label = "final-print") {
  return `${orderFileFolder(orderId, customerName)}/final-pdf/${Date.now()}-${safeFileSegment(label)}.pdf`;
}
