"use client";

import QRCode from "react-qr-code";

export function WhatsAppOrderCard({ whatsappLink }: { whatsappLink: string }) {
  if (!whatsappLink) {
    return null;
  }

  return (
    <div className="mt-6 border border-black/10 bg-mist p-5">
      <p className="text-sm font-black text-ink">Continue on WhatsApp</p>
      <p className="mt-2 text-sm leading-6 text-graphite">Payment will be confirmed on WhatsApp for now.</p>
      <div className="mt-4 inline-block border border-ink/10 bg-white p-3">
        <QRCode size={144} value={whatsappLink} />
      </div>
      <a className="link-block mt-4" href={whatsappLink} rel="noreferrer" target="_blank">
        Continue on WhatsApp
      </a>
    </div>
  );
}
