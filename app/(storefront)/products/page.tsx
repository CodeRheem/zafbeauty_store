import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/storefront/product-card";
import { Reveal } from "@/components/landing/reveal";
import { EditorialHeader } from "@/components/storefront/editorial-header";
import { cn } from "@/lib/utils";

type ProductImage = { storage_path: string; is_primary: boolean };
type ProductCategory = { name: string; slug: string } | null;

const CONSULT_LINK =
  "https://wa.me/2348052378401?text=Hi%20Zaf%20Beauty!%20I%27d%20love%20a%20personal%20routine%20recommendation.";

const MARQUEE_WORDS = [
  "Clean formulas",
  "Face · Body",
  "Everyday ritual",
  "Made to reorder",
  "100+ happy clients",
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  let query = supabase
    .from("products")
    .select(
      "id, name, slug, price, category_id, product_images(storage_path, is_primary), categories(name, slug)"
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (categorySlug) {
    const matchedCategory = categories?.find((c) => c.slug === categorySlug);
    if (matchedCategory) {
      query = query.eq("category_id", matchedCategory.id);
    }
  }

  const { data: products } = await query;

  const activeCategory = categories?.find((c) => c.slug === categorySlug);
  const count = products?.length ?? 0;

  return (
    <div>
      <EditorialHeader
        eyebrow="The Zaf edit"
        seal
        title={
          activeCategory ? (
            activeCategory.name
          ) : (
            <>
              Shop the <span className="italic">full edit</span>
            </>
          )
        }
        description="A tight, considered shelf of face and body essentials — chosen for what they do, not how they photograph."
        meta={[
          `${count} ${count === 1 ? "product" : "products"}`,
          "Face · Body",
          "Everyday ritual",
        ]}
      />

      <section className="border-b border-primary/10 bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 sm:py-4">
          <span className="hidden shrink-0 text-[0.58rem] font-medium uppercase tracking-[0.28em] text-primary/40 sm:inline">
            Filter
          </span>
          <div className="relative min-w-0 flex-1">
            <div className="flex snap-x gap-2 overflow-x-auto rounded-full border border-primary/10 bg-card/60 p-1.5 pr-10 [scrollbar-width:none] sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:pr-0 [&::-webkit-scrollbar]:hidden">
              <Link
                href="/products"
                className={cn(
                  "shrink-0 snap-start rounded-full border px-3.5 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.14em] transition duration-300 active:scale-95 sm:px-4 sm:text-[0.66rem] sm:tracking-[0.16em]",
                  !categorySlug
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary/15 text-primary/70 hover:border-primary/40 hover:text-primary"
                )}
              >
                All
              </Link>
              {categories?.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={cn(
                    "shrink-0 snap-start rounded-full border px-3.5 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.14em] transition duration-300 active:scale-95 sm:px-4 sm:text-[0.66rem] sm:tracking-[0.16em]",
                    categorySlug === cat.slug
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary/15 text-primary/70 hover:border-primary/40 hover:text-primary"
                  )}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <span
              className="pointer-events-none absolute inset-y-0 right-0 w-10 rounded-r-full bg-linear-to-l from-background to-transparent sm:hidden"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {!products || products.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center sm:py-24">
            <span className="flex size-14 items-center justify-center rounded-full border border-primary/20 text-primary">
              <Sparkles className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-serif text-2xl text-primary sm:text-3xl">
              {activeCategory ? "Restocking this edit" : "Nothing here yet"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {activeCategory
                ? "This collection is being curated — check back soon or browse the full range."
                : "The shelf is being restocked. Check back shortly for something good."}
            </p>
            <Link
              href="/products"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99]"
            >
              Browse everything
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-11 lg:grid-cols-4">
            {products.map((product, index) => {
              const images = product.product_images as unknown as ProductImage[];
              const primaryImage =
                images?.find((img) => img.is_primary) ?? images?.[0];
              const category = product.categories as unknown as ProductCategory;

              return (
                <ProductCard
                  key={product.id}
                  productId={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  imagePath={primaryImage?.storage_path ?? null}
                  categoryName={category?.name}
                  index={index}
                />
              );
            })}
          </div>
        )}
      </section>

      <div className="relative overflow-hidden border-y border-primary/10 bg-primary py-3.5 text-white">
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
                  className="flex items-center gap-6 px-6 text-[0.6rem] font-semibold uppercase tracking-[0.2em] sm:gap-8 sm:px-8 sm:text-xs sm:tracking-[0.24em]"
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

      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-1/4 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-7 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-6 sm:py-16">
          <Reveal>
            <p className="text-[0.56rem] font-medium uppercase tracking-[0.26em] text-primary-foreground/60 sm:text-[0.6rem] sm:tracking-[0.32em]">
              Personal consultation
            </p>
            <h2 className="mt-3 font-serif text-[1.8rem] leading-tight sm:mt-4 sm:text-4xl">
              Not sure where to{" "}
              <span className="italic text-primary-foreground">begin?</span>
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
