"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { useFavorites } from "@/components/favorites/favorites-provider";

export function HeaderIcons() {
  const { totalItems: cartCount } = useCart();
  const { totalItems: favCount } = useFavorites();

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/favorites"
        className="relative p-2 text-muted-foreground transition-colors hover:text-primary"
        aria-label="Favorites"
      >
        <Heart aria-hidden="true" size={19} strokeWidth={1.8} />
        {favCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground transition-transform animate-in zoom-in">
            {favCount}
          </span>
        )}
      </Link>

      <Link
        href="/cart"
        className="relative p-2 text-muted-foreground transition-colors hover:text-primary"
        aria-label="Cart"
      >
        <ShoppingBag aria-hidden="true" size={19} strokeWidth={1.8} />
        {cartCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground transition-transform animate-in zoom-in">
            {cartCount}
          </span>
        )}
      </Link>
    </div>
  );
}