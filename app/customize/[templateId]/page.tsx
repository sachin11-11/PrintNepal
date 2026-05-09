import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TemplateCustomizationClient } from "@/components/TemplateCustomizationClient";
import { getLocalTemplateByIdentifier } from "@/lib/templates/catalog";

export const dynamic = "force-dynamic";

export default function CustomizeTemplatePage({ params }: { params: { templateId: string } }) {
  const template = getLocalTemplateByIdentifier(params.templateId);
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
