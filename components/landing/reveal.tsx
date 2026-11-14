"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

const MOBILE_QUERY = "(max-width: 639px)";

export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduceMotion = useReducedMotion();
  // Timing-only difference, so it is safe to read during the first client render.
  const [isMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(MOBILE_QUERY).matches
  );

  const hiddenY = reduceMotion ? 0 : y;
  const duration = reduceMotion ? 0 : isMobile ? 0.45 : 0.65;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: hiddenY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: isMobile ? "-24px" : "-48px" }}
      transition={{
        duration,
        delay: reduceMotion ? 0 : isMobile ? delay * 0.5 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
