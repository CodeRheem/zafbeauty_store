"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/components/favorites/favorites-provider";
import { getProductImageUrl, buildWhatsAppSingleProductLink } from "@/lib/storefront";

export default function FavoritesPage() {
  const { items, removeFavorite } = useFavorites();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-serif text-3xl text-primary">Your Favorites</h1>

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
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {items.map((item) => (
            <div key={item.productId} className="group">
              <Link href={`/products/${item.slug}`}>
                <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/40">
                  {item.imagePath ? (
                    <Image
                      src={getProductImageUrl(item.imagePath)}
                      alt={item.name}
                      fill
                      className="object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
              </Link>

              <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                  <Link href={`/products/${item.slug}`}>
                    <p className="font-medium">{item.name}</p>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    ₦{item.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => removeFavorite(item.productId)}
                  aria-label="Remove from favorites"
                  className="text-lg transition active:scale-90"
                >
                  ♥
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