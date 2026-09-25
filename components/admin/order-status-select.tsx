"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteLoader } from "@/components/site-loader";

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
    <div className="relative min-h-9 min-w-36">
      {isPending && <SiteLoader label="UPDATING STATUS" />}
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
    </div>
  );
}