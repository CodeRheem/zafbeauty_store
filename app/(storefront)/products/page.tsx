import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getProductImageUrl } from "@/lib/storefront";
import { cn } from "@/lib/utils";

type ProductImage = { storage_path: string; is_primary: boolean };

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
      "id, name, slug, price, category_id, product_images(storage_path, is_primary), categories(slug)"
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-center">
        <h1 className="font-serif text-3xl text-primary">
          {activeCategory ? activeCategory.name : "All Products"}
        </h1>
      </div>

      {/* Category filter chips */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Link
          href="/products"
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm transition",
            !categorySlug
              ? "border-primary bg-primary text-primary-foreground"
              : "hover:border-primary"
          )}
        >
          All
        </Link>
        {categories?.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition",
              categorySlug === cat.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:border-primary"
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Product grid */}
      {!products || products.length === 0 ? (
        <div className="mt-16 text-center text-muted-foreground">
          No products found in this category yet.
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            const images = product.product_images as unknown as ProductImage[];
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
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
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
      )}
    </div>
  );
}