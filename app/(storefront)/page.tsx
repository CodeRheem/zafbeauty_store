import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getProductImageUrl } from "@/lib/storefront";
import { LeafMotif } from "@/components/leaf-motif";

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
      {/* Hero — asymmetric, headline paired with a botanical line motif */}
      <section className="overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:py-24 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-4">
          <div>
            <p className="text-sm tracking-wide text-muted-foreground">
              Face • Body • Everyday ritual
            </p>
            <h1 className="mt-3 max-w-md font-serif text-4xl leading-[1.1] text-primary sm:text-5xl">
              Skincare that grows from what your skin already knows.
            </h1>
            <p className="mt-5 max-w-sm text-muted-foreground">
              Zaf Beauty makes clean, considered skincare — face wash to
              sunscreen — formulated for the routine you actually keep.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-7 py-3 text-base font-medium text-primary-foreground transition hover:opacity-90"
            >
              Shop the range
            </Link>
          </div>

          <div className="mx-auto h-64 w-56 sm:h-80 sm:w-72 md:h-96 md:w-80">
            <LeafMotif />
          </div>
        </div>
      </section>

      {/* Brand philosophy — three quiet pillars, no icons/numbers needed */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
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
              We'd rather you run out and come back than shelve something
              half-used.
            </p>
          </div>
        </div>
      </section>

      {/* Categories — tactile horizontal strip instead of a plain card grid */}
      <section className="border-y bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-serif text-2xl text-primary">
            Find your routine
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="rounded-full border border-primary/20 bg-background px-5 py-2.5 text-sm transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-primary">Fan favorites</h2>
            <Link
              href="/products"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              View all
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
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
                  className="group block transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/40 transition-shadow duration-200 group-hover:shadow-md">
                    {primaryImage ? (
                      <Image
                        src={getProductImageUrl(primaryImage.storage_path)}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      ₦{product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}