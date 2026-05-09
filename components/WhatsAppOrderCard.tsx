"use client";

import QRCode from "react-qr-code";

export function WhatsAppOrderCard({ whatsappLink }: { whatsappLink: string }) {
  if (!whatsappLink) {
    return null;
  }

  return (
    <div className="mt-6 rounded-3xl border border-black/10 bg-mist p-5">
      <p className="text-sm font-medium text-ink">Continue on WhatsApp</p>
      <p className="mt-2 text-sm leading-6 text-graphite">Payment will be confirmed on WhatsApp for now.</p>
      <div className="mt-4 inline-block rounded-2xl bg-white p-3">
        <QRCode size={144} value={whatsappLink} />
      </div>
      <a className="mt-4 flex min-h-11 w-fit items-center rounded-full bg-ink px-5 text-sm font-medium text-white" href={whatsappLink} rel="noreferrer" target="_blank">
        Continue on WhatsApp
      </a>
    </div>
  );
}
