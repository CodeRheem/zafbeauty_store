"use client";

import { useRouter } from "next/navigation";

export function AdminAccessLogo() {
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    const confirmed = window.confirm(
      "This will take you to the admin sign-in page, not the Zaf Beauty homepage. Continue?"
    );
    if (confirmed) {
      router.push("/admin/login");
    }
  }

  return (
    <a
      href="/admin/login"
      onClick={handleClick}
      className="font-serif text-xl text-primary"
    >
      Zaf Beauty
    </a>
  );
}