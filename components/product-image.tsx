import Image from "next/image";
import { cn } from "@/lib/utils";
import { getProductImageUrl } from "@/lib/storefront";

export function ProductImage({
  storagePath,
  alt,
  sizes,
  priority = false,
  className,
  imageClassName,
}: {
  storagePath: string | null | undefined;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  const src = storagePath ? getProductImageUrl(storagePath) : null;

  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-xl border border-primary/10 bg-secondary/40",
        className
      )}
    >
      {src ? (
        <>
          {/* Soft fill so the frame is always fully covered */}
          <Image
            src={src}
            alt=""
            aria-hidden="true"
            fill
            sizes={sizes}
            className="scale-110 object-cover opacity-30 blur-2xl"
          />
          <span className="absolute inset-0 bg-background/25" aria-hidden="true" />
          {/* The product itself stays fully inside the border */}
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={cn(
              "object-contain object-center p-4",
              imageClassName
            )}
          />
        </>
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          No image
        </div>
      )}
    </div>
  );
}
