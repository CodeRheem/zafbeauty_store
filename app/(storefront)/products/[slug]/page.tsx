import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/product-image";
import { ProductActions } from "@/components/product-actions";

type ProductImage = { storage_path: string; is_primary: boolean };

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

  const images = (
    product.product_images as unknown as (ProductImage & {
      display_order: number;
    })[]
  ).sort((a, b) => a.display_order - b.display_order);
  const primaryImage = images.find((img) => img.is_primary) ?? images[0];

  const inStock = product.stock_quantity > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
        {/* Image */}
        <ProductImage
          storagePath={primaryImage?.storage_path}
          alt={product.name}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="self-start md:sticky md:top-24"
          imageClassName="p-5 sm:p-6"
        />

        {/* Details */}
        <div>
          {product.categories && (
            <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
              {(product.categories as unknown as { name: string }).name}
            </p>
          )}
          <h1 className="mt-2 break-words font-serif text-2xl text-primary sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-xl font-semibold sm:text-2xl">
              ₦{product.price.toLocaleString()}
            </span>
            {product.compare_at_price && (
              <span className="text-muted-foreground line-through">
                ₦{product.compare_at_price.toLocaleString()}
              </span>
            )}
          </div>

          {product.volume && (
            <p className="mt-1 text-sm text-muted-foreground">
              {product.volume}
            </p>
          )}

          <p className="mt-2 text-sm">
            {inStock ? (
              <span className="text-primary">In stock</span>
            ) : (
              <span className="text-destructive">Out of stock</span>
            )}
          </p>

          {product.description && (
            <p className="mt-4 text-muted-foreground">
              {product.description}
            </p>
          )}

          {/* Skin type / concern tags */}
          {(product.skin_types?.length > 0 ||
            product.skin_concerns?.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.skin_types?.map((type: string) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
              {product.skin_concerns?.map((concern: string) => (
                <Badge key={concern} variant="outline">
                  {concern}
                </Badge>
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

          {/* Key ingredients */}
          {product.key_ingredients?.length > 0 && (
            <div className="mt-8">
              <h2 className="font-medium">Key ingredients</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.key_ingredients.map((ing: string) => (
                  <Badge key={ing} variant="outline">
                    {ing}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* How to use */}
          {product.how_to_use && (
            <div className="mt-6">
              <h2 className="font-medium">How to use</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {product.how_to_use}
              </p>
            </div>
          )}

          {/* Full ingredients */}
          {product.ingredients && (
            <div className="mt-6">
              <h2 className="font-medium">Ingredients</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {product.ingredients}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}