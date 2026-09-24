import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getProductImageUrl } from "@/lib/storefront";

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
      {/* Hero */}
      <section className="border-b bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="font-serif text-4xl text-primary sm:text-5xl">
            Skincare, rooted in nature
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Zaf Beauty brings you clean, effective skincare — from face wash
            to sunscreen — made for your everyday routine.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition hover:opacity-90"
          >
            Shop all products
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center font-serif text-2xl text-primary">
          Shop by category
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="rounded-lg border bg-card p-6 text-center transition hover:border-primary hover:shadow-sm"
            >
              <span className="font-medium">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center font-serif text-2xl text-primary">
            Featured products
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
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
                  className="group"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/40">
                    {primaryImage ? (
                      <Image
                        src={getProductImageUrl(primaryImage.storage_path)}
                        alt={product.name}
                        fill
                        className="object-cover transition group-hover:scale-105"
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