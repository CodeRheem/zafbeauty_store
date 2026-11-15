import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

type ProductImageRow = { storage_path: string; is_primary: boolean };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: categories }, { data: product }] = await Promise.all([
    supabase.from("categories").select("id, name").order("name"),
    supabase
      .from("products")
      .select("*, product_images(storage_path, is_primary)")
      .eq("id", id)
      .single(),
  ]);

  if (!product) notFound();

  const images = product.product_images as unknown as ProductImageRow[];
  const primaryImage = images?.find((image) => image.is_primary) ?? images?.[0];

  return (
    <div className="space-y-5">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-muted-foreground"
      >
        <Link href="/admin" className="transition-colors hover:text-primary">
          Products
        </Link>
        <ChevronRight className="size-3 text-primary/30" aria-hidden="true" />
        <span className="line-clamp-1 text-primary/70">Edit product</span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-primary sm:text-3xl">
            Edit product
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
        </div>

        <DeleteProductButton
          productId={product.id}
          productName={product.name}
        />
      </div>

      <ProductForm
        categories={categories ?? []}
        product={product}
        imagePath={primaryImage?.storage_path ?? null}
      />
    </div>
  );
}
