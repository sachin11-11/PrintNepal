import { redirect } from "next/navigation";

export function generateStaticParams() {
  return [{ slug: "wedding-catalogs-cards" }];
}

export default function ServiceDetailPage() {
  redirect("/templates/wedding-card-01");
}
