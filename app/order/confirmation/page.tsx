import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/StatusBadge";
import { WhatsAppOrderCard } from "@/components/WhatsAppOrderCard";
import { getOrderForConfirmation } from "@/lib/actions/orders";

export const metadata = {
  title: "Order Confirmation | PrintNepal",
  description: "Your PrintNepal order confirmation and order status."
};

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  searchParams
}: {
  searchParams?: { orderId?: string };
}) {
  const order = searchParams?.orderId
    ? await getOrderForConfirmation(searchParams.orderId)
    : null;

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="print-panel p-6 sm:p-8">
          <p className="eyebrow">Order confirmation</p>
          {order ? (
            <>
              <h1 className="mt-4 text-5xl font-black leading-tight text-ink">Order received.</h1>
              <p className="mt-5 text-sm leading-6 text-graphite">
                Keep this order ID for tracking and communication with PrintNepal.
              </p>
              <div className="mt-8 grid gap-4 border border-black/10 bg-mist p-5">
                <div>
                  <span className="text-xs uppercase tracking-[0.18em] text-graphite">Order ID</span>
                  <p className="mt-2 break-all font-mono text-sm text-ink">{order.id}</p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-graphite">Current status</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <a className="link-block mt-6" href="/track-order">
                Track Order
              </a>
              <WhatsAppOrderCard whatsappLink={order.whatsapp_link ?? ""} />
            </>
          ) : (
            <>
              <h1 className="mt-4 text-5xl font-black leading-tight text-ink">Order not found.</h1>
              <p className="mt-5 text-sm leading-6 text-graphite">The confirmation link is missing a valid order ID.</p>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
