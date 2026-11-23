import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";
import type { Publication } from "@/lib/publications";

export default function PublicationCard({ item }: { item: Publication }) {
  const href = encodeURI(item.pdf);
  const src = encodeURI(item.image);

  return (
    <article className="flex h-full flex-col gap-4">
      <a
        href={href}
        download
        aria-label={`Download ${item.title}`}
        className="group relative block aspect-[3/4] overflow-hidden rounded-[20px] bg-cloud"
      >
        <Image
          src={src}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 80vw, 300px"
          className="object-cover object-top transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
        />
        <span className="absolute left-3.5 top-3.5 z-10 rounded-md bg-white/90 px-2.5 py-1 text-[11px] font-bold tracking-wide text-ink">
          PDF
        </span>
        <span className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute bottom-3.5 right-3.5 z-10 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-brand text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Download className="h-4 w-4" />
        </span>
      </a>

      <div className="flex flex-1 flex-col gap-3.5 px-0.5">
        <h3 className="min-h-[3rem] font-display text-[17px] font-semibold leading-snug text-ink">
          {item.title}
        </h3>
        <a
          href={href}
          download
          className="group/btn mt-auto inline-flex w-fit items-center gap-2.5 rounded-full border-[1.6px] border-brand px-5 py-2.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand hover:text-white"
        >
          Download PDF
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
        </a>
      </div>
    </article>
  );
}
