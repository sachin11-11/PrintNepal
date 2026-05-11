import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { OrderForm } from "@/components/OrderForm";

export const metadata = {
  title: "Print Order | PrintNepal",
  description: "Choose a print product, configure quantity and delivery, pay with a Nepali wallet, and place an order."
};

export const dynamic = "force-dynamic";

export default function OrderPage({
  searchParams
}: {
  searchParams?: { product?: string };
}) {
  return (
    <main>
      <Header />
      <section className="print-band">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <div className="mb-8 grid gap-5 border-l-4 border-press bg-white/75 p-5 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
          <p className="eyebrow">Print order</p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-ink sm:text-6xl">Order print products without friction.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-graphite">
            Select an item, configure size, paper, quantity, delivery, and payment in one continuous flow.
          </p>
          </div>
          <div className="border border-ink/10 bg-mist p-4 text-sm leading-6 text-graphite">
            The quote and production steps appear only after a product is selected.
          </div>
        </div>
        <OrderForm initialProductId={searchParams?.product} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
