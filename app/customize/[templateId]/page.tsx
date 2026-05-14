import { notFound } from "next/navigation";
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
      <Header flat />
      <section className="min-h-[calc(100dvh-9.5rem)] lg:min-h-[calc(100dvh-6.25rem)]">
        <TemplateCustomizationClient template={template} />
      </section>
    </main>
  );
}
