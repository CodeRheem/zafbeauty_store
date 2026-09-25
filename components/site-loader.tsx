"use client";

import { ImageGenerationLoader } from "@/components/ui/image-generation-loader";
import { cn } from "@/lib/utils";

export function SiteLoader({
  className,
  label = "LOADING",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-20 overflow-hidden bg-background/80",
        className,
      )}
      role="status"
      aria-label={label}
    >
      <ImageGenerationLoader
        text={label}
        effect="shimmer"
        easing="cubic-bezier(0.22, 1, 0.36, 1)"
        duration={2600}
        bandHeight={44}
        colors={["var(--color-rose-300)", "var(--color-primary)"]}
        overlayOpacity={0.14}
      />
    </div>
  );
}
