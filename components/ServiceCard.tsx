import Image from "next/image";
import type { Service } from "@/lib/data";
import { ArrowIcon } from "./Icons";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <a
      href={`/services/${service.slug}`}
      className="group flex min-h-80 flex-col overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
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
          <span className="rounded-full border border-black/10 bg-mist px-3 py-1 text-xs font-medium text-graphite">
          {service.category}
          </span>
          <h3 className="mt-5 text-xl font-semibold text-ink">{service.title}</h3>
          <p className="mt-3 text-sm leading-6 text-graphite">{service.description}</p>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-4 text-sm">
          <span className="text-graphite">{service.price}</span>
          <span className="rounded-full border border-black/10 p-2 text-graphite transition group-hover:text-ink">
            <ArrowIcon />
          </span>
        </div>
      </div>
    </a>
  );
}
