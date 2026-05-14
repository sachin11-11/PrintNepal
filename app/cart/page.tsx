import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Cart | PrintNepal",
  description: "Review print items before placing an order with PrintNepal."
};

export default function CartPage() {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="print-panel p-8 sm:p-10">
          <p className="eyebrow">Cart</p>
          <h1 className="mt-4 text-5xl font-black leading-tight text-ink">Your cart is empty.</h1>
          <p className="mt-5 text-sm leading-6 text-graphite">
            Start by choosing what you want to print. The selected print item, quantity, paper, delivery, and payment details will be reviewed here when cart persistence is connected.
          </p>
          <a className="link-block mt-8" href="/order">
            Start Order
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
