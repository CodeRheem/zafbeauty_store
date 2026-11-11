"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/components/favorites/favorites-provider";
import { ProductImage } from "@/components/product-image";
import { buildWhatsAppSingleProductLink } from "@/lib/storefront";

export default function FavoritesPage() {
  const { items, removeFavorite } = useFavorites();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="font-serif text-2xl text-primary sm:text-3xl">Your Favorites</h1>

      {items.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">No favorites yet.</p>
          <Link
            href="/products"
            className="mt-4 inline-block text-primary underline"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 sm:gap-x-6 sm:gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.productId} className="group">
              <Link href={`/products/${item.slug}`}>
                <ProductImage
                  storagePath={item.imagePath}
                  alt={item.name}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </Link>

              <div className="mt-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link href={`/products/${item.slug}`}>
                    <p className="line-clamp-2 text-sm font-medium sm:text-base">
                      {item.name}
                    </p>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => removeFavorite(item.productId)}
                  aria-label="Remove from favorites"
                  className="shrink-0 p-1 text-primary transition hover:text-destructive active:scale-90"
                >
                  <Heart className="size-4 fill-current" aria-hidden="true" />
                </button>
              </div>

              <a
                href={buildWhatsAppSingleProductLink(item.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
              >
                Buy Now via WhatsApp
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}