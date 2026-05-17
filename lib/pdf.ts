import "server-only";

import { PDFDocument } from "pdf-lib";

export function dataUrlToBuffer(dataUrl: string) {
  const [, base64 = ""] = dataUrl.split(",");
  return Buffer.from(base64, "base64");
}

export async function imageDataUrlToPdfBuffer(dataUrl: string) {
  const pdf = await PDFDocument.create();
  const imageBytes = dataUrlToBuffer(dataUrl);
  const image = dataUrl.includes("image/jpeg") || dataUrl.includes("image/jpg")
    ? await pdf.embedJpg(imageBytes)
    : await pdf.embedPng(imageBytes);
  const page = pdf.addPage([image.width, image.height]);

  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height
  });

  return Buffer.from(await pdf.save());
}
