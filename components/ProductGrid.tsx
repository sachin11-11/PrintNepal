import type { Service } from "@/lib/data";
import { ServiceCard } from "./ServiceCard";

export function ProductGrid({ products }: { products: Service[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ServiceCard key={product.slug} service={product} />
      ))}
    </div>
  );
}
