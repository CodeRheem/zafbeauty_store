import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Plus,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  AdminProductList,
  type AdminProduct,
} from "@/components/admin/admin-product-list";

type ProductImageRow = { storage_path: string; is_primary: boolean };

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, name, price, stock_quantity, is_active, product_images(storage_path, is_primary), categories(name)"
    )
    .order("created_at", { ascending: false });

  const normalized: AdminProduct[] = (products ?? []).map((product) => {
    const images = product.product_images as unknown as ProductImageRow[];
    const primaryImage =
      images?.find((image) => image.is_primary) ?? images?.[0];

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock_quantity,
      isActive: product.is_active,
      categoryName:
        (product.categories as unknown as { name: string } | null)?.name ??
        null,
      imagePath: primaryImage?.storage_path ?? null,
    };
  });

  const total = normalized.length;
  const active = normalized.filter((product) => product.isActive).length;
  const lowStock = normalized.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;
  const outOfStock = normalized.filter(
    (product) => product.stock <= 0
  ).length;

  const stats = [
    {
      label: "Total products",
      value: total,
      hint: "In the catalog",
      icon: Package,
    },
    {
      label: "Active",
      value: active,
      hint: "Visible on storefront",
      icon: CheckCircle2,
    },
    {
      label: "Low stock",
      value: lowStock,
      hint: "5 or fewer left",
      icon: AlertTriangle,
    },
    {
      label: "Out of stock",
      value: outOfStock,
      hint: "Needs restocking",
      icon: XCircle,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-[radial-gradient(110%_140%_at_90%_-10%,var(--color-secondary)_0%,transparent_58%),radial-gradient(80%_100%_at_0%_110%,var(--color-muted)_0%,transparent_60%)] p-5 sm:p-7">
        <div
          className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full border border-primary/15"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.58rem] font-medium uppercase tracking-[0.28em] text-primary/60 sm:text-[0.62rem]">
              Dashboard &middot; Overview
            </p>
            <h1 className="mt-2 font-serif text-3xl leading-tight text-primary sm:text-4xl">
              Your <span className="italic">catalog</span>
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              Manage products, stock, and what appears on the storefront — all
              in one calm place.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99] sm:w-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add product
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-2xl border border-primary/10 bg-card/70 p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[0.55rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {stat.label}
              </p>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/70 text-primary">
                <stat.icon className="size-4" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 font-serif text-2xl text-primary sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1 text-[0.68rem] leading-tight text-muted-foreground">
              {stat.hint}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl text-primary sm:text-2xl">
              Products
            </h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Search, review, and jump into any product.
            </p>
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Failed to load products: {error.message}
          </p>
        )}

        {!error && total === 0 && (
          <div className="rounded-2xl border border-dashed border-primary/20 bg-card/40 px-5 py-16 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-primary/20 text-primary">
              <Package className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-serif text-xl text-primary">
              No products yet
            </h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
              Add your first product and it will show up here, ready to manage.
            </p>
            <Link
              href="/admin/products/new"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99]"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add your first product
            </Link>
          </div>
        )}

        {!error && total > 0 && <AdminProductList products={normalized} />}
      </div>
    </div>
  );
}
