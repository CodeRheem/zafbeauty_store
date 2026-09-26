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
        className="font-serif text-xl text-primary transition-opacity hover:opacity-80"
      >
        Zaf Beauty
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