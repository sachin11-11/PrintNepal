import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TrackOrderForm } from "@/components/TrackOrderForm";

export const metadata = {
  title: "Track Order | PrintNepal",
  description: "Track your PrintNepal order status from received through delivered."
};

export default function TrackOrderPage() {
  return (
    <main>
      <Header />
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">Track order</p>
        <h1 className="mt-4 font-serif text-5xl leading-tight text-ink sm:text-6xl">Check print status.</h1>
        <p className="mt-5 text-lg leading-8 text-graphite">Enter the email and order ID from your confirmation page.</p>
        <TrackOrderForm />
      </section>
      <Footer />
    </main>
  );
}
