"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { Reveal } from "@/components/landing/reveal";
import { useFavorites } from "@/components/favorites/favorites-provider";
import { cn } from "@/lib/utils";

export function ProductCard({
  productId,
  name,
  slug,
  price,
  imagePath,
  categoryName,
  index = 0,
}: {
  productId: string;
  name: string;
  slug: string;
  price: number;
  imagePath: string | null;
  categoryName?: string | null;
  index?: number;
}) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(productId);

  return (
    <Reveal delay={Math.min(index * 0.04, 0.28)} y={20}>
      <article className="group">
        <div className="relative">
          <Link href={`/products/${slug}`} className="block active:opacity-90">
            <ProductImage
              storagePath={imagePath}
              alt={name}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="rounded-xl border-primary/10 bg-secondary/30 transition-colors duration-500 group-hover:border-primary/30 sm:rounded-2xl"
              imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          </Link>

          <button
            type="button"
            onClick={() =>
              toggleFavorite({ productId, name, slug, price, imagePath })
            }
            aria-label={
              favorited
                ? `Remove ${name} from favorites`
                : `Add ${name} to favorites`
            }
            aria-pressed={favorited}
            className={cn(
              "absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur transition active:scale-90",
              favorited
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Heart
              className={cn(
                "size-4 transition-transform",
                favorited && "scale-110 fill-primary"
              )}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="mt-3 sm:mt-3.5">
          {categoryName && (
            <p className="text-[0.52rem] font-medium uppercase tracking-[0.18em] text-primary/50 sm:text-[0.55rem] sm:tracking-[0.22em]">
              {categoryName}
            </p>
          )}
          <Link href={`/products/${slug}`}>
            <h3 className="mt-1 line-clamp-2 font-serif text-[0.95rem] leading-snug text-primary transition-colors duration-300 hover:text-primary/80 sm:text-lg">
              {name}
            </h3>
          </Link>
          <p className="mt-1 text-[0.82rem] text-muted-foreground sm:text-sm">
            ₦{price.toLocaleString()}
          </p>
        </div>
      </article>
    </Reveal>
  );
}
