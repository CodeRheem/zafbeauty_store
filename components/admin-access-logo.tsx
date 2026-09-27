"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AdminAccessLogo() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    setOpen(true);
  }

  function handleConfirm() {
    setOpen(false);
    router.push("/admin/login");
  }

  return (
    <>
      <a
        href="/admin/login"
        onClick={handleClick}
        className="group inline-flex items-baseline gap-1.5 transition-opacity hover:opacity-85"
      >
        <span className="relative font-serif text-base italic text-primary">
          Zaf
          {/* Small leaf accent, positioned over the "a" */}
          <svg
            viewBox="0 0 24 24"
            className="absolute left-[79%] -top-1 h-4 w-4 -translate-x-1/2"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 22 C 12 16, 12 10, 16.5 3"
              stroke="var(--color-primary)"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M12.5 14 C 8.5 14, 5.5 11.5, 4.5 7.5 C 8.5 7.5, 11.5 9.5, 12.5 14"
              stroke="var(--color-primary)"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.5 10 C 14.5 6, 16.5 3, 20 1.5 C 20 5.5, 18 8.5, 14.5 10"
              stroke="var(--color-primary)"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-[0.6rem] font-medium tracking-[0.3em] text-primary">
          BEAUTY
        </span>
      </a>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-primary">
              Admin sign-in
            </DialogTitle>
            <DialogDescription>
              This takes you to the Zaf Beauty admin sign-in page, not the
              storefront homepage. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}