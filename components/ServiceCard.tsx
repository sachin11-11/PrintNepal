import Image from "next/image";
import type { Service } from "@/lib/data";
import { ArrowIcon } from "./Icons";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <a
      href={`/services/${service.slug}`}
      className="atelier-card group flex min-h-80 flex-col overflow-hidden transition hover:-translate-y-1"
    >
      <div className="aspect-[4/3] overflow-hidden bg-mist">
        <Image
          alt={`${service.title} print sample`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          height={700}
          src={service.image_url}
          width={900}
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <span className="atelier-chip px-3 py-1 text-xs font-bold uppercase tracking-[0.08em]">
          {service.category}
          </span>
          <h3 className="mt-5 text-xl font-black text-ink">{service.title}</h3>
          <p className="mt-3 text-sm leading-6 text-graphite">{service.description}</p>
        </div>
        <div className="mt-8 flex items-center justify-between rounded-lg bg-mist p-3 text-sm">
          <span className="text-graphite">{service.price}</span>
          <span className="rounded-md bg-[var(--surface)] p-2 text-graphite transition group-hover:bg-[var(--solid)] group-hover:text-[var(--solid-text)]">
            <ArrowIcon />
          </span>
        </div>
      </div>
    </a>
  );
}
