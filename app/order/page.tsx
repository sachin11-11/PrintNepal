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
      <section className="order-flow-stage">
        <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
          <OrderForm initialProductId={searchParams?.product} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
