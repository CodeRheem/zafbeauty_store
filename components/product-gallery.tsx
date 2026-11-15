"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product-image";
import { cn } from "@/lib/utils";

type GalleryImage = { storage_path: string; is_primary: boolean };

export function ProductGallery({
  images,
  name,
}: {
  images: GalleryImage[];
  name: string;
}) {
  const primaryIndex = images.findIndex((image) => image.is_primary);
  const [active, setActive] = useState(primaryIndex >= 0 ? primaryIndex : 0);
  const current = images[active] ?? images[0];

  return (
    <div className="md:sticky md:top-24">
      <ProductImage
        storagePath={current?.storage_path}
        alt={name}
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
        className="rounded-2xl"
        imageClassName="p-5 sm:p-7"
      />

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={`${image.storage_path}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1} of ${name}`}
              aria-pressed={index === active}
              className={cn(
                "relative overflow-hidden rounded-lg transition duration-300",
                index === active
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "opacity-75 hover:opacity-100"
              )}
            >
              <ProductImage
                storagePath={image.storage_path}
                alt=""
                sizes="80px"
                className="rounded-lg bg-secondary/30"
                imageClassName="p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
