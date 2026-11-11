import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductImage } from "@/components/product-image";
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="text-center">
        <h1 className="font-serif text-2xl text-primary sm:text-3xl">
          {activeCategory ? activeCategory.name : "All Products"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {products?.length ?? 0} {(products?.length ?? 0) === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Category filter chips */}
      <div className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8">
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
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-10 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {products.map((product) => {
            const images = product.product_images as unknown as ProductImage[];
            const primaryImage =
              images?.find((img) => img.is_primary) ?? images?.[0];

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group block"
              >
                <ProductImage
                  storagePath={primaryImage?.storage_path}
                  alt={product.name}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="mt-3">
                  <p className="line-clamp-2 text-sm font-medium sm:text-base">
                    {product.name}
                  </p>
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