import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-primary">Add product</h1>
        <p className="text-sm text-muted-foreground">
          Add a new item to the Zaf Beauty catalog
        </p>
      </div>

      <ProductForm categories={categories ?? []} />
    </div>
  );
}