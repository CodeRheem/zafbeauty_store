"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { useFavorites } from "@/components/favorites/favorites-provider";
import { buildWhatsAppSingleProductLink } from "@/lib/storefront";

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Quantity picker */}
        <div className="flex w-full items-center justify-between rounded-md border sm:w-fit sm:self-auto sm:justify-start">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 transition hover:bg-secondary active:scale-90"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-2 transition hover:bg-secondary active:scale-90"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Favorite toggle */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          className="flex w-full items-center justify-center rounded-md border px-4 py-2.5 text-primary transition hover:bg-secondary/60 active:scale-90 sm:w-fit sm:self-auto"
        >
          <Heart
            className={`size-5 transition-transform ${
              favorited ? "scale-110 fill-primary" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`inline-flex flex-1 items-center justify-center rounded-md border border-primary px-6 py-3 text-base font-medium text-primary transition hover:bg-primary/5 active:scale-[0.98] ${
            !inStock ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {!inStock ? "Out of stock" : added ? "Added ✓" : "Add to cart"}
        </button>

        <a
          href={buildWhatsAppSingleProductLink(name)}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!inStock}
          className={`inline-flex flex-1 items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98] ${
            !inStock ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {inStock ? "Place Order" : "Out of stock"}
        </a>
      </div>
    </div>
  );
}