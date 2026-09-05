import Link from "next/link";
import Image from "next/image";
import { formataDataFirestore } from "@/lib/news/format";

export function NewsListItem({ noticia }) {
  return (
    <Link
      href={`/noticias/${noticia.id}`}
      className="group overflow-hidden rounded-[14px] border border-linha bg-superficie"
    >
      <div className="relative h-40 w-full bg-creme">
        {noticia.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={noticia.coverUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src="/brand/simbolo-crescer.png"
            alt=""
            width={64}
            height={64}
            className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 opacity-70"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-titulo text-lg font-bold uppercase leading-snug text-titulo group-hover:underline">
          {noticia.title}
        </h3>
        <p className="mt-1 text-sm text-texto/60">
          {formataDataFirestore(noticia.publishedAt)}
        </p>
      </div>
    </Link>
  );
}
