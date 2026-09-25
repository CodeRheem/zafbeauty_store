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
          <header className="border-b">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
              <AdminAccessLogo />
              <nav className="flex items-center gap-6 text-sm">
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
                <Link href="/products" className="hover:text-primary">
                  Shop
                </Link>
                <HeaderIcons />
              </nav>
            </div>
            <div className="mx-auto max-w-6xl px-4 pb-3">
              <BackButton />
            </div>
          </header>

          <main className="flex-1 animate-in fade-in duration-300">
            {children}
          </main>

          <footer className="border-t bg-secondary/30">
            <div className="mx-auto max-w-6xl px-4 py-12">
              <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
                <div className="max-w-xs">
                  <p className="font-serif text-lg text-primary">
                    Zaf Beauty
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Clean, considered skincare for the routine you actually
                    keep.
                  </p>
                </div>
                <div className="flex gap-10 text-sm">
                  <div>
                    <p className="font-medium">Shop</p>
                    <div className="mt-2 flex flex-col gap-1.5 text-muted-foreground">
                      <Link href="/products" className="hover:text-primary">
                        All products
                      </Link>
                      <Link href="/favorites" className="hover:text-primary">
                        Favorites
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10 border-t pt-6 text-xs text-muted-foreground">
                © {new Date().getFullYear()} Zaf Beauty. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}