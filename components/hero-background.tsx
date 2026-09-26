"use client";

import { useEffect, useState } from "react";
import AeroShards from "@/components/aero-shards";

export function HeroBackground() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // Feature-detect WebGPU. Unsupported browsers (older Safari, many
    // budget/older Android devices) fall back to a plain gradient instead
    // of a blank or broken hero.
    const hasWebGPU =
      typeof navigator !== "undefined" && "gpu" in navigator;
    setSupported(hasWebGPU);
  }, []);

  // While we haven't determined support yet (first client render), show the
  // safe fallback rather than flashing the heavy effect in and out.
  if (supported !== true) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-secondary/30"
      />
    );
  }

  return (
    <AeroShards
      backgroundColor="#FAF7EF"
      shardColor="#10B981"
      accentColor="#227d5f"
      placement="full"
      flow="stream"
      material="pearl"
      detail="balanced"
      effect="none"
      scale={1}
      spread={1}
      depth={1}
      speed={1}
      spin={1}
      interaction="repel"
      density={1.5}
      shardSize={1.1}
      stretch={1}
      turbulence={1}
      glow={1}
      edgeSoftness={2}
      bloom={0.5}
      grain={0.05}
      chromaticAberration={0.0075}
      transitionDuration={1}
      interactionRadius={1.5}
      interactionStrength={0.5}
      rippleIntensity={1}
      holdToGather
      paused={false}
      onError={() => setSupported(false)}
    />
  );
}