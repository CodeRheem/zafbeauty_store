"use client";

import { useState } from "react";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { ProductImage } from "@/components/product-image";
import { buildWhatsAppOrderLink } from "@/lib/storefront";
import { saveOrder } from "@/lib/actions/orders";

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } =
    useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      await saveOrder(
        items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        }))
      );
    } catch {
      // still let them complete via WhatsApp even if the DB save fails
    }

    const link = buildWhatsAppOrderLink(
      items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity }))
    );
    window.open(link, "_blank");
    clearCart();
    setCheckingOut(false);
  }

  return (
    <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="font-serif text-2xl text-primary sm:text-3xl">Your Cart</h1>

      {items.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-4 inline-block text-primary underline"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-3 rounded-xl border p-3 sm:gap-4 sm:p-4"
            >
              <ProductImage
                storagePath={item.imagePath}
                alt={item.name}
                sizes="96px"
                className="h-20 w-20 shrink-0 rounded-lg sm:h-24 sm:w-24"
                imageClassName="p-1.5"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-sm font-medium sm:text-base">
                    {item.name}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="shrink-0 text-xs text-muted-foreground transition-colors hover:text-destructive sm:text-sm"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  ₦{item.price.toLocaleString()}
                </p>

                <div className="mt-2 flex w-fit items-center rounded-md border">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    aria-label="Decrease quantity"
                    className="px-3 py-1 transition hover:bg-secondary active:scale-90"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                    className="px-3 py-1 transition hover:bg-secondary active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-lg border p-4">
            <div className="flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>₦{totalPrice.toLocaleString()}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              {checkingOut && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
              {checkingOut ? "Preparing order..." : "Checkout via WhatsApp"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}