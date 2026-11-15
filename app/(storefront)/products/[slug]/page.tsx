import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductGallery } from "@/components/product-gallery";
import { ProductActions } from "@/components/product-actions";
import { ProductCard } from "@/components/storefront/product-card";
import { Reveal } from "@/components/landing/reveal";
import { cn } from "@/lib/utils";

type GalleryImage = {
  storage_path: string;
  is_primary: boolean;
  display_order: number;
};

type CardImage = { storage_path: string; is_primary: boolean };

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      `*, product_images(storage_path, is_primary, display_order), categories(name, slug)`
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const category = product.categories as unknown as {
    name: string;
    slug: string;
  } | null;

  const images = (
    product.product_images as unknown as GalleryImage[]
  ).sort((a, b) => a.display_order - b.display_order);
  const primaryImage = images.find((img) => img.is_primary) ?? images[0];

  const { data: relatedProducts } = product.category_id
    ? await supabase
        .from("products")
        .select("id, name, slug, price, product_images(storage_path, is_primary)")
        .eq("is_active", true)
        .eq("category_id", product.category_id)
        .neq("id", product.id)
        .order("created_at", { ascending: false })
        .limit(4)
    : { data: null };

  const inStock = product.stock_quantity > 0;
  const tags = [
    ...(product.skin_types ?? []),
    ...(product.skin_concerns ?? []),
  ];
  const discount =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) /
            product.compare_at_price) *
            100
        )
      : null;

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-muted-foreground"
        >
          <Link href="/products" className="transition-colors hover:text-primary">
            Shop
          </Link>
          <ChevronRight className="size-3 text-primary/30" aria-hidden="true" />
          {category && (
            <>
              <Link
                href={`/products?category=${category.slug}`}
                className="transition-colors hover:text-primary"
              >
                {category.name}
              </Link>
              <ChevronRight
                className="size-3 text-primary/30"
                aria-hidden="true"
              />
            </>
          )}
          <span className="line-clamp-1 max-w-full break-words text-primary/70">
            {product.name}
          </span>
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={images} name={product.name} />

          <Reveal y={16}>
            <div>
              {category && (
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.28em] text-primary/60 sm:text-[0.62rem]">
                  {category.name}
                </p>
              )}

              <h1 className="mt-2 break-words font-serif text-3xl leading-[1.08] text-primary sm:text-4xl lg:text-[2.9rem]">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                <span className="font-serif text-2xl text-primary sm:text-3xl">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.compare_at_price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₦{product.compare_at_price.toLocaleString()}
                  </span>
                )}
                {discount !== null && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em] text-primary">
                    Save {discount}%
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                {product.volume && <span>{product.volume}</span>}
                {product.volume && (
                  <span
                    className="size-1 rounded-full bg-primary/25"
                    aria-hidden="true"
                  />
                )}
                <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-medium uppercase tracking-[0.18em]">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      inStock ? "bg-primary" : "bg-destructive"
                    )}
                    aria-hidden="true"
                  />
                  <span className={inStock ? "text-primary" : "text-destructive"}>
                    {inStock ? "In stock" : "Out of stock"}
                  </span>
                </span>
              </div>

              {product.description && (
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {product.description}
                </p>
              )}

              {tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full border border-primary/15 bg-secondary/30 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-primary/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <ProductActions
                productId={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                imagePath={primaryImage?.storage_path ?? null}
                inStock={inStock}
              />

              <div className="mt-8 divide-y divide-primary/10 border-y border-primary/10">
                {product.key_ingredients?.length > 0 && (
                  <section className="py-5">
                    <h2 className="flex items-center gap-2 text-[0.58rem] font-medium uppercase tracking-[0.28em] text-primary/50">
                      <Sparkles
                        className="size-3.5 text-primary/40"
                        aria-hidden="true"
                      />
                      Key ingredients
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {product.key_ingredients.map((ingredient: string) => (
                        <span
                          key={ingredient}
                          className="rounded-full border border-primary/15 px-2.5 py-1 text-[0.66rem] text-foreground/70"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {product.how_to_use && (
                  <section className="py-5">
                    <h2 className="text-[0.58rem] font-medium uppercase tracking-[0.28em] text-primary/50">
                      How to use
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {product.how_to_use}
                    </p>
                  </section>
                )}

                {product.ingredients && (
                  <section className="py-5">
                    <h2 className="text-[0.58rem] font-medium uppercase tracking-[0.28em] text-primary/50">
                      Full ingredients
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {product.ingredients}
                    </p>
                  </section>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && category && (
        <section className="border-t border-primary/10 bg-secondary/20">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <Reveal>
              <div className="flex flex-col gap-3 border-b border-primary/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[0.58rem] font-medium uppercase tracking-[0.28em] text-primary/60 sm:text-[0.62rem]">
                    Complete the routine
                  </p>
                  <h2 className="mt-2 break-words font-serif text-2xl text-primary sm:text-3xl">
                    More from <span className="italic">{category.name}</span>
                  </h2>
                </div>
                <Link
                  href={`/products?category=${category.slug}`}
                  className="group inline-flex items-center gap-2 self-start text-sm font-medium text-primary sm:self-auto"
                >
                  <span className="relative">
                    View category
                    <span
                      className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full"
                      aria-hidden="true"
                    />
                  </span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-4 sm:gap-x-6">
              {relatedProducts.map((related, index) => {
                const relatedImages =
                  related.product_images as unknown as CardImage[];
                const relatedImage =
                  relatedImages?.find((img) => img.is_primary) ??
                  relatedImages?.[0];

                return (
                  <ProductCard
                    key={related.id}
                    productId={related.id}
                    name={related.name}
                    slug={related.slug}
                    price={related.price}
                    imagePath={relatedImage?.storage_path ?? null}
                    categoryName={category.name}
                    index={index}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
