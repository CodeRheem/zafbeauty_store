"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { getProductImageUrl, buildWhatsAppOrderLink } from "@/lib/storefront";
import { saveOrder } from "@/lib/actions/orders";
import { SiteLoader } from "@/components/site-loader";

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
    <div className="relative mx-auto max-w-3xl px-4 py-12">
      {checkingOut && <SiteLoader label="PREPARING ORDER" />}
      <h1 className="font-serif text-3xl text-primary">Your Cart</h1>

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
              className="flex gap-4 rounded-lg border p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-secondary/40">
                {item.imagePath && (
                  <Image
                    src={getProductImageUrl(item.imagePath)}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{item.name}</p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-muted-foreground hover:text-destructive"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  ₦{item.price.toLocaleString()}
                </p>

                <div className="mt-2 flex items-center rounded-md border w-fit">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
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
              className="mt-4 w-full rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
            >
              {checkingOut ? "Preparing order..." : "Checkout via WhatsApp"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}