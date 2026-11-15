"use client";

import { usePathname, useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      <span aria-hidden="true">←</span>
      <span className="hidden sm:inline">Back</span>
    </button>
  );
}