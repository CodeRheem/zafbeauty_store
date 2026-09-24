"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
    >
      <span aria-hidden="true">←</span>
      Back
    </button>
  );
}