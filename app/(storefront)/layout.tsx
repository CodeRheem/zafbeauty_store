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

          <footer className="border-t">
            <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Zaf Beauty. All rights reserved.
            </div>
          </footer>
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}