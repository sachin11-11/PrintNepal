import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TemplateCustomizationClient } from "@/components/TemplateCustomizationClient";
import { getProductTemplateByIdentifier } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function CustomizeTemplatePage({ params }: { params: { templateId: string } }) {
  const template = await getProductTemplateByIdentifier(params.templateId);

  if (!template) {
    notFound();
  }

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <TemplateCustomizationClient template={template} />
      </section>
      <Footer />
    </main>
  );
}
