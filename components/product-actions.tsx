"use client";

import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { useFavorites } from "@/components/favorites/favorites-provider";
import { buildWhatsAppSingleProductLink } from "@/lib/storefront";
import { cn } from "@/lib/utils";

export function ProductActions({
  productId,
  name,
  slug,
  price,
  imagePath,
  inStock,
}: {
  productId: string;
  name: string;
  slug: string;
  price: number;
  imagePath: string | null;
  inStock: boolean;
}) {
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const favorited = isFavorite(productId);

  function handleAddToCart() {
    addItem({ productId, name, price, imagePath }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleToggleFavorite() {
    toggleFavorite({ productId, name, slug, price, imagePath });
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center justify-between rounded-full border border-primary/15 bg-background/60 p-1 sm:flex-none sm:justify-start">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-9 items-center justify-center rounded-full text-primary/70 transition hover:bg-secondary active:scale-90"
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <span className="w-8 text-center text-sm tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex size-9 items-center justify-center rounded-full text-primary/70 transition hover:bg-secondary active:scale-90"
            aria-label="Increase quantity"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorited}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-background/60 text-primary transition hover:border-primary/40 hover:bg-secondary/60 active:scale-90"
        >
          <Heart
            className={cn(
              "size-5 transition-transform",
              favorited && "scale-110 fill-primary"
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className={cn(
            "inline-flex flex-1 items-center justify-center rounded-full border border-primary px-6 py-3.5 text-sm font-medium text-primary transition duration-300 hover:bg-primary/5 active:scale-[0.99]",
            !inStock && "pointer-events-none opacity-50"
          )}
        >
          {!inStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
        </button>

        <a
          href={buildWhatsAppSingleProductLink(name)}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!inStock}
          className={cn(
            "inline-flex flex-1 items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99]",
            !inStock && "pointer-events-none opacity-50"
          )}
        >
          {inStock ? "Place Order" : "Out of stock"}
        </a>
      </div>
    </div>
  );
}
