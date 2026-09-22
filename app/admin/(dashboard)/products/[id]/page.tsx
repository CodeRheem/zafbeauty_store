import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: categories }, { data: product }] = await Promise.all([
    supabase.from("categories").select("id, name").order("name"),
    supabase.from("products").select("*").eq("id", id).single(),
  ]);

  if (!product) notFound();

  async function handleDelete() {
    "use server";
    await deleteProduct(id);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-primary">Edit product</h1>
          <p className="text-sm text-muted-foreground">{product.name}</p>
        </div>

        <form action={handleDelete}>
          <Button type="submit" variant="destructive" size="sm">
            Delete
          </Button>
        </form>
      </div>

      <ProductForm categories={categories ?? []} product={product} />
    </div>
  );
}