"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { ProductImage } from "@/components/product-image";
import { Reveal } from "@/components/landing/reveal";
import { EditorialHeader } from "@/components/storefront/editorial-header";
import { PageLoading } from "@/components/ui/page-loading";
import { buildWhatsAppOrderLink } from "@/lib/storefront";
import { saveOrder } from "@/lib/actions/orders";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    hydrated,
  } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  async function handleCheckout() {
    setCheckingOut(true);

    const link = buildWhatsAppOrderLink(
      items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity }))
    );

    // Open WhatsApp while the click still counts as a user gesture — otherwise
    // popup blockers can swallow it after the awaited server call.
    const orderWindow = window.open(link, "_blank");

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

    clearCart();
    setCheckingOut(false);

    if (!orderWindow) {
      window.location.href = link;
    }
  }

  if (!hydrated) {
    return (
      <div>
        <EditorialHeader
          compact
          eyebrow="Your bag"
          title={
            <>
              Your <span className="italic">bag</span>
            </>
          }
        />
        <PageLoading />
      </div>
    );
  }

  return (
    <div>
      <EditorialHeader
        compact
        eyebrow="Your bag"
        title={
          <>
            Your <span className="italic">bag</span>
          </>
        }
        description="Review the pieces you've chosen, adjust quantities, and send your order straight through WhatsApp."
        meta={[
          `${totalItems} ${totalItems === 1 ? "item" : "items"}`,
          "Checkout in WhatsApp",
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {items.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-card/50 px-5 py-16 text-center sm:py-24">
            <div
              className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-secondary/60 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-20 -right-10 size-56 rounded-full bg-primary/10 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-col items-center">
              <span className="flex size-14 items-center justify-center rounded-full border border-primary/20 bg-background/60 text-primary">
                <ShoppingBag className="size-6" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-serif text-2xl text-primary sm:text-3xl">
                Your bag is empty
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Nothing in here yet — the shelf is ready when you are.
              </p>
              <div className="mt-6 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99]"
                >
                  Browse the edit
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/favorites"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-background/60 px-6 py-3 text-sm font-medium text-primary transition duration-300 hover:border-primary/40 hover:bg-background active:scale-[0.99]"
                >
                  View favorites
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start lg:gap-10">
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-primary/10 pb-3">
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.28em] text-primary/40">
                  In your bag
                </p>
                <p className="text-[0.58rem] uppercase tracking-[0.2em] text-primary/40">
                  {items.length} {items.length === 1 ? "line" : "lines"}
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {items.map((item, index) => {
                  const lineTotal = item.price * item.quantity;

                  return (
                    <Reveal
                      key={item.productId}
                      delay={Math.min(index * 0.05, 0.25)}
                      y={16}
                    >
                      <article className="group flex gap-3 rounded-2xl border border-primary/10 bg-card/70 p-3 transition-colors duration-300 hover:border-primary/25 sm:gap-5 sm:p-4">
                        <ProductImage
                          storagePath={item.imagePath}
                          alt={item.name}
                          sizes="(max-width: 640px) 80px, 96px"
                          className="size-20 shrink-0 rounded-xl sm:size-24"
                          imageClassName="p-1.5"
                        />

                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="line-clamp-2 font-serif text-base leading-snug text-primary sm:text-lg">
                                {item.name}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                                ₦{item.price.toLocaleString()} each
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId)}
                              aria-label={`Remove ${item.name}`}
                              className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive active:scale-90"
                            >
                              <X className="size-4" aria-hidden="true" />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-end justify-between gap-2">
                            <div className="flex items-center rounded-full border border-primary/15 bg-background/60">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity - 1
                                  )
                                }
                                aria-label="Decrease quantity"
                                className="flex size-8 items-center justify-center rounded-full text-primary/70 transition hover:bg-secondary active:scale-90"
                              >
                                <Minus className="size-3.5" aria-hidden="true" />
                              </button>
                              <span className="w-7 text-center text-sm tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1
                                  )
                                }
                                aria-label="Increase quantity"
                                className="flex size-8 items-center justify-center rounded-full text-primary/70 transition hover:bg-secondary active:scale-90"
                              >
                                <Plus className="size-3.5" aria-hidden="true" />
                              </button>
                            </div>
                            <p className="font-serif text-base text-primary sm:text-lg">
                              ₦{lineTotal.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>

              <Link
                href="/products"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary"
              >
                <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
                <span className="relative">
                  Continue shopping
                  <span
                    className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </div>

            <Reveal delay={0.1} className="lg:sticky lg:top-24">
              <aside className="rounded-2xl border border-primary/10 bg-secondary/30 p-5 sm:p-6">
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.28em] text-primary/50">
                  Order summary
                </p>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted-foreground">
                      Subtotal ({totalItems}{" "}
                      {totalItems === 1 ? "item" : "items"})
                    </dt>
                    <dd className="font-medium text-foreground">
                      ₦{totalPrice.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd className="text-[0.6rem] font-medium uppercase tracking-[0.14em] text-primary/60">
                      Arranged on WhatsApp
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex items-baseline justify-between border-t border-primary/15 pt-4">
                  <span className="font-serif text-lg text-primary">Total</span>
                  <span className="font-serif text-2xl text-primary">
                    ₦{totalPrice.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
                >
                  {checkingOut && (
                    <LoaderCircle
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  {checkingOut ? "Preparing order..." : "Checkout via WhatsApp"}
                </button>

                <p className="mt-3 flex items-start justify-center gap-1.5 text-center text-[0.66rem] leading-relaxed text-muted-foreground">
                  <ShieldCheck
                    className="mt-0.5 size-3.5 shrink-0 text-primary/60"
                    aria-hidden="true"
                  />
                  You&apos;ll confirm your order and delivery details in
                  WhatsApp.
                </p>
              </aside>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}
