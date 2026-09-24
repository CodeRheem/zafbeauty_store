"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { useFavorites } from "@/components/favorites/favorites-provider";

export function HeaderIcons() {
  const { totalItems: cartCount } = useCart();
  const { totalItems: favCount } = useFavorites();

  return (
    <div className="flex items-center gap-4">
      <Link href="/favorites" className="relative p-2" aria-label="Favorites">
        <span aria-hidden="true" className="text-lg">
          ♡
        </span>
        {favCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground transition-transform animate-in zoom-in">
            {favCount}
          </span>
        )}
      </Link>

      <Link href="/cart" className="relative p-2" aria-label="Cart">
        <span aria-hidden="true" className="text-lg">
          🛍
        </span>
        {cartCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground transition-transform animate-in zoom-in">
            {cartCount}
          </span>
        )}
      </Link>
    </div>
  );
}