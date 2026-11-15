"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/product-image";
import { cn } from "@/lib/utils";

export type AdminProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  categoryName: string | null;
  imagePath: string | null;
};

function stockClasses(stock: number) {
  if (stock <= 0) return "border-destructive/30 text-destructive";
  if (stock <= 5) return "border-primary/25 text-primary";
  return "border-primary/15 text-muted-foreground";
}

export function AdminProductList({ products }: { products: AdminProduct[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        (product.categoryName ?? "").toLowerCase().includes(search)
    );
  }, [products, query]);

  return (
    <div className="rounded-2xl border border-primary/10 bg-card/60 p-3 sm:p-4">
      <div className="flex flex-col gap-3 border-b border-primary/10 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products or categories..."
            aria-label="Search products"
            className="h-9 rounded-full border-primary/15 bg-background/60 pl-9"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {filtered.length} of {products.length}{" "}
          {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No products match &ldquo;{query.trim()}&rdquo;.
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 rounded-xl border border-primary/10 bg-background/40 p-3 transition-colors hover:border-primary/25 hover:bg-card sm:gap-4 sm:p-3.5"
            >
              <ProductImage
                storagePath={product.imagePath}
                alt={product.name}
                sizes="56px"
                className="size-12 shrink-0 rounded-lg sm:size-14"
                imageClassName="p-1"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      product.isActive ? "bg-primary" : "bg-muted-foreground/40"
                    )}
                    aria-hidden="true"
                  />
                  <p className="truncate font-serif text-sm text-primary sm:text-base">
                    {product.name}
                  </p>
                </div>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.7rem] text-muted-foreground sm:text-xs">
                  <span>{product.categoryName ?? "Uncategorised"}</span>
                  <span
                    className="size-0.5 rounded-full bg-primary/30"
                    aria-hidden="true"
                  />
                  <span>₦{product.price.toLocaleString()}</span>
                  <span className="md:hidden">
                    &middot; {product.stock} in stock
                  </span>
                </p>
              </div>

              <span
                className={cn(
                  "hidden shrink-0 rounded-full border px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.12em] md:inline-flex",
                  stockClasses(product.stock)
                )}
              >
                {product.stock} in stock
              </span>

              <Badge
                variant={product.isActive ? "default" : "secondary"}
                className="hidden shrink-0 md:inline-flex"
              >
                {product.isActive ? "Active" : "Hidden"}
              </Badge>

              <Link
                href={`/admin/products/${product.id}`}
                aria-label={`Edit ${product.name}`}
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/15 text-primary/70 transition hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-90"
              >
                <Pencil className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
