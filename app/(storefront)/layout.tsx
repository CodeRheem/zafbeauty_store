import Link from "next/link";
import { AdminAccessLogo } from "@/components/admin-access-logo";
import { BackButton } from "@/components/back-button";
import { CartProvider } from "@/components/cart/cart-provider";
import { FavoritesProvider } from "@/components/favorites/favorites-provider";
import { HeaderIcons } from "@/components/header-logo";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/85 text-primary backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
              <AdminAccessLogo />
              <div className="flex items-center gap-1 sm:gap-3">
                <nav className="flex items-center gap-1 text-sm text-muted-foreground sm:gap-2">
                  <Link
                    href="/products"
                    className="rounded-md px-2 py-1.5 transition-colors hover:bg-secondary/60 hover:text-primary"
                  >
                    Shop
                  </Link>
                  <BackButton />
                </nav>
                <div className="ml-1 border-l border-primary/15 pl-2 sm:pl-3">
                  <HeaderIcons />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 animate-in fade-in duration-300">
            {children}
          </main>

          <footer className="border-t border-primary/10 bg-secondary/30">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-xs">
                  <p className="font-serif text-xl text-primary">
                    Zaf Beauty
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Clean, considered skincare for the routine you actually
                    keep.
                  </p>
                </div>
                <div className="flex gap-12 text-sm">
                  <div>
                    <p className="font-medium text-foreground">Shop</p>
                    <div className="mt-2 flex flex-col gap-1.5 text-muted-foreground">
                      <Link
                        href="/products"
                        className="transition-colors hover:text-primary"
                      >
                        All products
                      </Link>
                      <Link
                        href="/favorites"
                        className="transition-colors hover:text-primary"
                      >
                        Favorites
                      </Link>
                      <Link
                        href="/cart"
                        className="transition-colors hover:text-primary"
                      >
                        Your cart
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex flex-col gap-2 border-t border-primary/10 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>
                  © {new Date().getFullYear()} Zaf Beauty. All rights reserved.
                </p>
                <p>Face · Body · Everyday ritual</p>
              </div>
            </div>
          </footer>
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}