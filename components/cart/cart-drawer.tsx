"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/cart/cart-provider";
import { getProductImageUrl, buildWhatsAppOrderLink } from "@/lib/storefront";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, X } from "lucide-react";
import { saveOrder } from "@/lib/actions/orders";

export function CartDrawer() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const [open, setOpen] = useState(false);
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
        })),
      );
    } catch {
      // Even if the DB save fails, still let them complete via WhatsApp
    }

    const link = buildWhatsAppOrderLink(
      items.map((i) => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    );
    window.open(link, "_blank");
    clearCart();
    setCheckingOut(false);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="relative p-2" aria-label="Open cart">
        <ShoppingBag className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {totalItems}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-primary">Your cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Your cart is empty.
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto px-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary/40">
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
                    <p className="text-sm font-medium">{item.name}</p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      aria-label="Remove item"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ₦{item.price.toLocaleString()}
                  </p>

                  <div className="mt-1 flex items-center rounded-md border w-fit">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="p-1 hover:bg-secondary"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="p-1 hover:bg-secondary"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-3">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? "Preparing order..." : "Checkout via WhatsApp"}
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
