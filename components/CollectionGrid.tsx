import Image from "next/image";
import { collections } from "@/lib/data";

export function CollectionGrid() {
  return (
    <div className="grid auto-rows-[17rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {collections.map((collection) => (
        <article
          key={collection.title}
          className={`group relative overflow-hidden rounded-[1.75rem] border border-black/10 bg-gradient-to-br ${collection.tone} shadow-sm transition hover:-translate-y-1 hover:shadow-soft ${collection.className}`}
        >
          <Image
            alt={`${collection.title} print collection`}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            src={collection.image_url}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-white/10" />
          <div className="relative flex h-full flex-col justify-between p-5">
            <span className="w-fit rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium text-graphite">
              {collection.material}
            </span>
            <div>
              <h3 className="text-xl font-semibold text-white">{collection.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/82">{collection.description}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
