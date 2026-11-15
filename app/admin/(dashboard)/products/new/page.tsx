import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

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
        <span className="text-primary/70">Add product</span>
      </nav>

      <div>
        <h1 className="font-serif text-2xl text-primary sm:text-3xl">
          Add product
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new item to the Zaf Beauty catalog.
        </p>
      </div>

      <ProductForm categories={categories ?? []} />
    </div>
  );
}
