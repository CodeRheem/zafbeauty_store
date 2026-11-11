import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductImage } from "@/components/product-image";
import { HeroBackground } from "@/components/hero-background";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: featuredProducts }] =
    await Promise.all([
      supabase.from("categories").select("id, name, slug").order("name"),
      supabase
        .from("products")
        .select(
          "id, name, slug, price, product_images(storage_path, is_primary)"
        )
        .eq("is_active", true)
        .eq("is_featured", true)
        .limit(8),
    ]);

  return (
    <div>
      {/* Hero — full-bleed animated background with text overlaid for legibility */}
      <section className="relative flex min-h-[560px] items-center overflow-hidden py-14 sm:h-[600px] sm:py-0">
        <div className="absolute inset-0 z-0">
          <HeroBackground />
        </div>

        <div className="relative z-20 mx-auto flex w-full max-w-6xl items-center px-4 sm:px-6">
          <div className="w-full max-w-lg rounded-2xl border border-primary/15 bg-background/95 p-6 text-foreground shadow-xl backdrop-blur-md sm:p-8 lg:p-10">
            <p className="text-xs tracking-[0.18em] text-foreground/60 uppercase sm:text-sm sm:tracking-wide sm:normal-case">
              Face • Body • Everyday ritual
            </p>
            <h1 className="mt-3 font-serif text-3xl leading-[1.08] text-primary sm:text-4xl lg:text-5xl">
              Glow with confidence.
            </h1>
            <p className="mt-4 max-w-sm text-sm text-foreground/70 sm:mt-5 sm:text-base">
              Zaf beauty curates effective and affordable routines from
              toners-sunscreens there’s something for everyone. Over a hundred
              satisfied clients…
            </p>
            <Link
              href="/products"
              className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-primary px-7 py-3 text-base font-medium text-primary-foreground transition hover:opacity-90 active:scale-[0.99] sm:mt-8 sm:w-auto"
            >
              Shop the range
            </Link>
          </div>
        </div>
      </section>

      {/* Brand philosophy — three quiet pillars, no icons/numbers needed */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-10">
          <div>
            <h3 className="font-serif text-lg text-primary">
              Formulated simply
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Fewer, better ingredients — chosen for what they do, not how
              they photograph.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-primary">
              Built for real routines
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Products that fit into a five-minute morning, not a
              twelve-step ritual.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg text-primary">
              Made to reorder
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We’d rather you run out and come back than shelve something
              half-used.
            </p>
          </div>
        </div>
      </section>

      {/* Categories — editorial routine index */}
      <section className="border-y bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[0.65rem] font-medium tracking-[0.35em] text-accent uppercase">
                The collections
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-[1.15] text-primary sm:text-4xl">
                Find your <span className="italic">routine</span>
              </h2>
              <p className="mt-3 font-serif text-lg text-primary/60 sm:text-xl">
                by step, not by guesswork.
              </p>
              <p className="mt-4 max-w-sm text-sm text-muted-foreground sm:text-base">
                A tight edit of essentials, grouped by the moment they belong
                to. Choose a category and build a routine that actually lasts.
              </p>
              <Link
                href="/products"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary"
              >
                Browse the full edit
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="border-t border-primary/15">
              {categories?.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group flex items-center justify-between gap-4 border-b border-primary/15 py-5 transition-colors hover:bg-background/70 sm:py-6"
                >
                  <span className="flex items-baseline gap-4 sm:gap-6">
                    <span className="font-serif text-xs tabular-nums text-primary/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-xl text-primary transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
                      {category.name}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="hidden text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:inline">
                      Explore
                    </span>
                    <span className="flex size-8 items-center justify-center rounded-full border border-primary/15 text-primary/50 transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </span>
                </Link>
              ))}
              {(!categories || categories.length === 0) && (
                <p className="py-6 text-sm text-muted-foreground">
                  Collections are being curated — check back soon.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured products — considered shelf */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-4 border-b border-primary/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.65rem] font-medium tracking-[0.35em] text-accent uppercase">
                The considered few
              </p>
              <h2 className="mt-3 font-serif text-3xl text-primary sm:text-4xl">
                Fan <span className="italic">favorites</span>
              </h2>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 self-start text-sm font-medium text-primary sm:self-auto"
            >
              View all products
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {featuredProducts.map((product) => {
              const images = product.product_images as unknown as {
                storage_path: string;
                is_primary: boolean;
              }[];
              const primaryImage =
                images?.find((img) => img.is_primary) ?? images?.[0];

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group block"
                >
                  <div className="relative">
                    <ProductImage
                      storagePath={primaryImage?.storage_path}
                      alt={product.name}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <span className="pointer-events-none absolute top-3 right-3 flex size-8 translate-y-1 items-center justify-center rounded-full bg-background/90 text-primary opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                  <div className="mt-3.5">
                    <p className="line-clamp-2 text-sm font-medium sm:text-base">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      ₦{product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Closing note — personal recommendation */}
      <section className="border-t border-primary/10 bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-14">
          <div>
            <p className="text-[0.65rem] font-medium tracking-[0.35em] text-primary-foreground/60 uppercase">
              Personal consultation
            </p>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
              Not sure where to begin?
            </h2>
            <p className="mt-2 max-w-md text-sm text-primary-foreground/70">
              Tell us about your skin and we’ll build a routine around you.
            </p>
          </div>
          <a
            href="https://wa.me/2348052378401?text=Hi%20Zaf%20Beauty!%20I%27d%20love%20a%20personal%20routine%20recommendation."
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-md bg-primary-foreground px-6 py-3 text-sm font-medium text-primary transition hover:opacity-90 active:scale-[0.99] sm:self-auto"
          >
            Chat with us
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </div>
      </section>
    </div>
  );
}