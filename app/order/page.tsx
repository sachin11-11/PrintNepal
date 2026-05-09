import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { OrderForm } from "@/components/OrderForm";
import { getMaterials, getProductDesigns, getServices } from "@/lib/supabase/queries";

export const metadata = {
  title: "Start Order | PrintNepal",
  description: "Send a print order request to PrintNepal with service, material, quantity, and design file details."
};

export const dynamic = "force-dynamic";

export default async function OrderPage() {
  const [services, materials] = await Promise.all([
    getServices(),
    getMaterials()
  ]);
  const designs = await getProductDesigns().catch(() => []);

  return (
    <main>
      <Header />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">Send design</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-ink sm:text-6xl">Start a print order.</h1>
          <p className="mt-6 text-lg leading-8 text-graphite">
            Share the product, quantity, material, and deadline. File upload is static for now and will connect to Supabase Storage later.
          </p>
        </div>
        <OrderForm designs={designs} materials={materials} services={services} />
      </section>
      <Footer />
    </main>
  );
}
