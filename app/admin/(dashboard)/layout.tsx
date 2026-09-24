import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/admin" className="font-serif text-lg text-primary">
            Zaf Beauty Admin
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Orders
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View Storefront ↗
            </Link>
            {user && (
              <form action={signOut}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}