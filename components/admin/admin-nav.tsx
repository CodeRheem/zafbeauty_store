"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();
  const productsActive =
    pathname === "/admin" || pathname.startsWith("/admin/products");

  return (
    <nav className="flex items-center gap-1 text-sm">
      <Link
        href="/admin"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors",
          productsActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary/60 hover:text-primary"
        )}
      >
        <LayoutGrid className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Products</span>
      </Link>
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-primary"
      >
        <ExternalLink className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Storefront</span>
      </Link>
    </nav>
  );
}
