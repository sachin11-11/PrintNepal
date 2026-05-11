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
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="border-l-4 border-brass bg-white/80 p-5">
          <p className="eyebrow">Track order</p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-ink sm:text-6xl">Check print status.</h1>
          <p className="mt-5 text-base leading-7 text-graphite">Enter the email and order ID from your confirmation page.</p>
        </div>
        <TrackOrderForm />
      </section>
      <Footer />
    </main>
  );
}
