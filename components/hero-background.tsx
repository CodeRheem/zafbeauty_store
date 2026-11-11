"use client";

import { useEffect, useState } from "react";
import AeroShards from "@/components/aero-shards";

export function HeroBackground() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    // Heavier WebGPU shards are reserved for larger screens with support.
    // Phones, reduced-motion users and unsupported browsers get the light
    // ambient treatment instead of a blank or broken hero.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const hasWebGPU = "gpu" in navigator;
    // Hydration-safe: capabilities can only be detected on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(isDesktop && hasWebGPU && !prefersReducedMotion);
  }, []);

  // While support is being determined (first client render), show the safe
  // fallback rather than flashing the heavy effect in and out.
  if (supported !== true) {
    return (
      <div aria-hidden="true" className="hero-ambient">
        <span className="hero-orb hero-orb-1" />
        <span className="hero-orb hero-orb-2" />
        <span className="hero-orb hero-orb-3" />
        <span className="hero-sheen" />
      </div>
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