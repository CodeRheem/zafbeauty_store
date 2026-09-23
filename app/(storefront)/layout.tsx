import Link from "next/link";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="font-serif text-xl text-primary">
              Zaf Beauty
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <Link href="/products" className="hover:text-primary">
                Shop
              </Link>
              <CartDrawer />
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Zaf Beauty. All rights reserved.
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}