import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { AdminNav } from "@/components/admin/admin-nav";

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
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-3">
          <Link
            href="/admin"
            className="group inline-flex items-baseline gap-1.5 transition-opacity hover:opacity-85"
          >
            <span className="font-logo text-lg italic text-primary">Zaf</span>
            <span className="text-[0.55rem] font-medium tracking-[0.3em] text-primary">
              BEAUTY
            </span>
            <span className="ml-1 hidden rounded-full bg-primary/10 px-2 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-primary sm:inline-block">
              Admin
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <AdminNav />
            {user && (
              <>
                <span
                  className="mx-1 hidden h-5 w-px bg-primary/15 sm:block"
                  aria-hidden="true"
                />
                <form action={signOut}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-muted-foreground hover:text-destructive"
                  >
                    <LogOut aria-hidden="true" />
                    <span className="hidden sm:inline">Sign out</span>
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
