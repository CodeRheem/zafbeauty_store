"use client";

import { ImageGenerationLoader } from "@/components/ui/image-generation-loader";

export default function ImageGenerationLoaderShimmerDemo() {
  return (
    <div className="w-full px-6 py-10 sm:p-12">
      <div className="relative mx-auto aspect-4/3 w-full max-w-xl overflow-hidden rounded-2xl bg-neutral-900 outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
        <img
          src="https://assets.aceternity.com/components/vertical-sliding-loader-demo-dark.webp"
          alt="A dark project creation interface"
          className="size-full object-cover"
        />
        <ImageGenerationLoader
          effect="shimmer"
          easing="cubic-bezier(0.22, 1, 0.36, 1)"
          duration={3200}
          bandHeight={44}
          colors={["var(--color-violet-400)", "var(--color-indigo-700)"]}
          overlayOpacity={0.24}
        />
      </div>
    </div>
  );
}
