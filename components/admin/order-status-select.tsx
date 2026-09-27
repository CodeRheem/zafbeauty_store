"use client";

import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { updateOrderStatus } from "@/lib/actions/orders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = ["pending", "confirmed", "shipped", "completed", "cancelled"];

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string | null) {
    if (!value) return;
    startTransition(() => {
      updateOrderStatus(orderId, value);
    });
  }

  return (
    <div className="flex min-h-9 min-w-36 items-center gap-2">
      <Select value={status} onValueChange={handleChange}>
        <SelectTrigger className="w-36" disabled={isPending}>
          <SelectValue>
            {STATUSES.find((s) => s === status) ?? status}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isPending && <LoaderCircle className="size-4 animate-spin text-muted-foreground" aria-label="Updating status" />}
    </div>
  );
}