"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag, Sparkles } from "lucide-react";
import { useFavorites } from "@/components/favorites/favorites-provider";
import { useCart } from "@/components/cart/cart-provider";
import { ProductImage } from "@/components/product-image";
import { Reveal } from "@/components/landing/reveal";
import { EditorialHeader } from "@/components/storefront/editorial-header";
import { PageLoading } from "@/components/ui/page-loading";

export default function FavoritesPage() {
  const { items, removeFavorite, hydrated } = useFavorites();
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  function handleAdd(productId: string, name: string, price: number, imagePath: string | null) {
    addItem({ productId, name, price, imagePath }, 1);
    setAddedId(productId);
    window.setTimeout(
      () => setAddedId((current) => (current === productId ? null : current)),
      1500
    );
  }

  if (!hydrated) {
    return (
      <div>
        <EditorialHeader
          compact
          eyebrow="Saved for later"
          title={
            <>
              Your <span className="italic">favorites</span>
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
        seal
        eyebrow="Saved for later"
        title={
          <>
            Your <span className="italic">favorites</span>
          </>
        }
        description="A little shelf of the pieces you're keeping an eye on. Add them to your bag whenever you're ready."
        meta={[
          `${items.length} ${items.length === 1 ? "piece" : "pieces"} saved`,
          "Tap the heart to remove",
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
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
                <Sparkles className="size-6" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-serif text-2xl text-primary sm:text-3xl">
                No favorites yet
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Tap the heart on anything you love and it&apos;ll live here for
                later.
              </p>
              <Link
                href="/products"
                className="group mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99]"
              >
                Browse the edit
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-11 lg:grid-cols-4">
            {items.map((item, index) => (
              <Reveal
                key={item.productId}
                delay={Math.min(index * 0.04, 0.28)}
                y={20}
              >
                <article className="group">
                  <div className="relative">
                    <Link
                      href={`/products/${item.slug}`}
                      className="block active:opacity-90"
                    >
                      <ProductImage
                        storagePath={item.imagePath}
                        alt={item.name}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="rounded-xl border-primary/10 bg-secondary/30 transition-colors duration-500 group-hover:border-primary/30 sm:rounded-2xl"
                        imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                    </Link>
                    <button
                      onClick={() => removeFavorite(item.productId)}
                      aria-label={`Remove ${item.name} from favorites`}
                      className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/90 text-primary shadow-sm backdrop-blur transition hover:text-destructive active:scale-90"
                    >
                      <Heart className="size-4 fill-current" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-3 sm:mt-3.5">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="line-clamp-2 font-serif text-[0.95rem] leading-snug text-primary transition-colors duration-300 hover:text-primary/80 sm:text-lg">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="mt-1 text-[0.82rem] text-muted-foreground sm:text-sm">
                      ₦{item.price.toLocaleString()}
                    </p>

                    <button
                      onClick={() =>
                        handleAdd(
                          item.productId,
                          item.name,
                          item.price,
                          item.imagePath
                        )
                      }
                      className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/20 px-3 py-2 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-primary transition duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.98] sm:text-[0.62rem]"
                    >
                      <ShoppingBag className="size-3.5" aria-hidden="true" />
                      {addedId === item.productId ? "Added" : "Add to bag"}
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
