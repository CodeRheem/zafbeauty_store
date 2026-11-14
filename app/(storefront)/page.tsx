import Link from "next/link";
import { ArrowRight, ArrowUpRight, Leaf, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductImage } from "@/components/product-image";
import { Reveal } from "@/components/landing/reveal";
import { RotatingSeal } from "@/components/landing/rotating-seal";

const CONSULT_LINK =
  "https://wa.me/2348052378401?text=Hi%20Zaf%20Beauty!%20I%27d%20love%20a%20personal%20routine%20recommendation.";

const MARQUEE_WORDS = [
  "Clean formulas",
  "Face · Body",
  "Everyday ritual",
  "Made to reorder",
  "100+ happy clients",
];

const PILLARS = [
  {
    title: "Formulated simply",
    body: "Fewer, better ingredients — chosen for what they do, not how they photograph.",
  },
  {
    title: "Built for real routines",
    body: "Products that fit into a five-minute morning, not a twelve-step ritual.",
  },
  {
    title: "Made to reorder",
    body: "We’d rather you run out and come back than shelve something half-used.",
  },
];

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
      {/* Hero — static brand backdrop with editorial copy overlaid */}
      <section className="relative flex min-h-[520px] items-start overflow-hidden pt-9 pb-14 sm:min-h-[680px] sm:items-center sm:py-0">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 overflow-hidden bg-background"
        >
          <div className="absolute inset-0 bg-[radial-gradient(120%_95%_at_85%_0%,var(--color-secondary)_0%,transparent_60%),radial-gradient(90%_70%_at_0%_100%,var(--color-muted)_0%,transparent_60%)]" />
          <div className="absolute -right-20 -top-24 size-64 rounded-full border border-primary/15 sm:size-80 lg:size-[30rem]" />
          <div className="absolute -right-8 top-1/2 hidden size-[38rem] -translate-y-1/2 rounded-full border border-primary/10 lg:block" />
          <div className="absolute right-[8%] top-1/2 hidden size-[26rem] -translate-y-1/2 rounded-full border border-primary/15 lg:block" />
          <span className="pointer-events-none absolute -right-3 top-8 select-none font-logo text-[13rem] italic leading-none text-primary/[0.05] sm:hidden">
            z
          </span>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-background" />
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-r from-background via-background/85 to-transparent sm:via-background/60 lg:from-background/85 lg:via-background/40" />

        <div className="relative z-20 mx-auto grid w-full max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-xl">
            <Reveal>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.55rem] font-medium tracking-[0.26em] text-primary/70 uppercase sm:gap-x-3 sm:text-[0.6rem] sm:tracking-[0.32em]">
                <span
                  className="h-px w-8 bg-primary sm:w-10"
                  aria-hidden="true"
                />
                <span>Face</span>
                <span className="text-primary/35" aria-hidden="true">
                  ·
                </span>
                <span>Body</span>
                <span className="text-primary/35" aria-hidden="true">
                  ·
                </span>
                <span>Everyday ritual</span>
              </p>
            </Reveal>

            <Reveal delay={0.08} y={22}>
              <h1 className="mt-4 font-serif text-[2.7rem] leading-[1.02] text-primary sm:mt-5 sm:text-6xl lg:text-[4.35rem]">
                Glow with
                <span className="mt-1 block italic text-primary">
                  confidence.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/70 sm:mt-6 sm:text-base">
                Zaf beauty curates effective and affordable routines from toners-sunscreen there&apos;s something for everyone.
                Over a hundred satisfied clients...
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
                <Link
                  href="/products"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99]"
                >
                  <span className="relative z-10">Shop the range</span>
                  <ArrowRight
                    className="relative z-10 size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute inset-y-0 -left-full w-full bg-linear-to-r from-transparent via-primary-foreground/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[200%]"
                    aria-hidden="true"
                  />
                </Link>

                <a
                  href={CONSULT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-background/60 px-7 py-3.5 text-sm font-medium text-primary backdrop-blur-sm transition duration-300 hover:border-primary/40 hover:bg-background active:scale-[0.99]"
                >
                  Chat with us
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-primary/15 pt-5 sm:mt-10">
                <div>
                  <dt className="font-serif text-lg text-primary sm:text-2xl">
                    100+
                  </dt>
                  <dd className="mt-1 text-[0.55rem] tracking-[0.14em] text-muted-foreground uppercase sm:text-[0.6rem] sm:tracking-[0.18em]">
                    Happy clients
                  </dd>
                </div>
                <div>
                  <dt className="font-serif text-lg text-primary sm:text-2xl">
                    100%
                  </dt>
                  <dd className="mt-1 text-[0.55rem] tracking-[0.14em] text-muted-foreground uppercase sm:text-[0.6rem] sm:tracking-[0.18em]">
                    Considered
                  </dd>
                </div>
                <div>
                  <dt className="font-serif text-lg text-primary sm:text-2xl">
                    Daily
                  </dt>
                  <dd className="mt-1 text-[0.55rem] tracking-[0.14em] text-muted-foreground uppercase sm:text-[0.6rem] sm:tracking-[0.18em]">
                    Ritual ready
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <div className="relative hidden justify-end lg:flex">
            <Reveal delay={0.35} y={0}>
              <RotatingSeal />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Brand ribbon — quiet motion, editorial type */}
      <div className="relative overflow-hidden border-y border-primary/10 bg-primary py-4 text-white">
        <div className="landing-marquee flex w-max items-center">
          {[0, 1].map((group) => (
            <div
              key={group}
              className="flex shrink-0 items-center"
              aria-hidden={group === 1}
            >
              {MARQUEE_WORDS.map((word) => (
                <span
                  key={`${group}-${word}`}
                  className="flex items-center gap-8 px-8 text-[0.7rem] font-semibold tracking-[0.24em] uppercase sm:text-xs"
                >
                  {word}
                  <Star
                    className="size-3 fill-white text-white/80"
                    aria-hidden="true"
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Brand philosophy — three quiet pillars */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-[0.65rem] font-medium tracking-[0.35em] text-primary/60 uppercase">
              The Zaf standard
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-[1.15] text-primary sm:text-4xl">
              Considered from the <span className="italic">first drop</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {PILLARS.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 0.08}>
              <article className="group h-full rounded-2xl border border-primary/10 bg-card/70 p-5 shadow-[0_1px_0_oklch(1_0_0/0.6)_inset] backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 motion-reduce:transform-none sm:p-6">
                <span className="font-serif text-xs tabular-nums text-primary/50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-serif text-lg text-primary">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.body}
                </p>
                <span
                  className="mt-5 block h-px w-0 bg-primary transition-all duration-500 group-hover:w-12"
                  aria-hidden="true"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Philosophy band — one confident line */}
      <section className="relative overflow-hidden border-y border-primary/10 bg-secondary/30 py-14 sm:py-20">
        <div
          className="pointer-events-none absolute -left-24 top-1/2 size-80 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-full border border-primary/25 text-primary">
            <Leaf className="size-5" aria-hidden="true" />
          </span>
          <blockquote className="mt-6 font-serif text-2xl italic leading-snug text-primary sm:text-[2.1rem]">
            “Fewer, better things — for the skin you live in.”
          </blockquote>
          <p className="mt-4 text-[0.62rem] font-medium tracking-[0.35em] text-muted-foreground uppercase">
            The Zaf philosophy
          </p>
        </Reveal>
      </section>

      {/* Categories — editorial routine index */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[0.65rem] font-medium tracking-[0.35em] text-primary/60 uppercase">
                The collections
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-[1.15] text-primary sm:text-4xl">
                Find your <span className="italic">routine</span>
              </h2>
              <p className="mt-3 font-serif text-lg text-primary/60 sm:text-xl">
                by step, not by guesswork.
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
                A tight edit of essentials, grouped by the moment they belong
                to. Choose a category and build a routine that actually lasts.
              </p>
              <Link
                href="/products"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary"
              >
                <span className="relative">
                  Browse the full edit
                  <span
                    className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full"
                    aria-hidden="true"
                  />
                </span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Reveal>

            <div className="border-t border-primary/15">
              {categories?.map((category, index) => (
                <Reveal key={category.id} delay={Math.min(index * 0.06, 0.3)}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="group flex items-center justify-between gap-4 border-b border-primary/15 py-5 transition-colors hover:bg-background/70 active:bg-background sm:py-6"
                  >
                    <span className="flex items-baseline gap-4 sm:gap-6">
                      <span className="font-serif text-xs tabular-nums text-primary/40 transition-colors duration-300 group-hover:text-primary">
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
                      <span className="flex size-9 items-center justify-center rounded-full border border-primary/15 text-primary/50 transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </span>
                  </Link>
                </Reveal>
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
        <section className="border-t border-primary/10 bg-secondary/20">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <Reveal>
              <div className="flex flex-col gap-4 border-b border-primary/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[0.65rem] font-medium tracking-[0.35em] text-primary/60 uppercase">
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
                  <span className="relative">
                    View all products
                    <span
                      className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full"
                      aria-hidden="true"
                    />
                  </span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-11 lg:grid-cols-4">
              {featuredProducts.map((product, index) => {
                const images = product.product_images as unknown as {
                  storage_path: string;
                  is_primary: boolean;
                }[];
                const primaryImage =
                  images?.find((img) => img.is_primary) ?? images?.[0];

                return (
                  <Reveal
                    key={product.id}
                    delay={Math.min(index * 0.05, 0.25)}
                    y={20}
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      className="group block active:opacity-90"
                    >
                      <div className="relative">
                        <ProductImage
                          storagePath={primaryImage?.storage_path}
                          alt={product.name}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="transition-colors duration-500 group-hover:border-primary/30"
                          imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        />
                        <span className="pointer-events-none absolute top-3 right-3 flex size-8 translate-y-1 items-center justify-center rounded-full bg-background/90 text-primary opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <ArrowUpRight className="size-4" />
                        </span>
                      </div>
                      <div className="mt-3.5">
                        <p className="line-clamp-2 text-sm font-medium transition-colors duration-300 group-hover:text-primary sm:text-base">
                          {product.name}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          ₦{product.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Closing note — personal recommendation */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-1/4 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-20">
          <Reveal>
            <p className="text-[0.65rem] font-medium tracking-[0.35em] text-primary-foreground/60 uppercase">
              Personal consultation
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Not sure where to <span className="italic text-primary-foreground">begin?</span>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/70">
              Tell us about your skin and we’ll build a routine around you — no
              guesswork, no clutter.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="w-full shrink-0 sm:w-auto">
            <a
              href={CONSULT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-foreground px-7 py-3.5 text-sm font-medium text-primary transition duration-300 hover:shadow-lg hover:shadow-black/20 active:scale-[0.99] sm:w-auto"
            >
              Chat with us
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
