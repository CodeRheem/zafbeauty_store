"use client";

import { motion } from "framer-motion";

const draw = (delay: number) => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.1, delay, ease: "easeInOut" as const }, opacity: { duration: 0.3, delay } },
  },
});

export function LeafMotif() {
  return (
    <motion.svg
      viewBox="0 0 320 380"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
      initial="hidden"
      animate="visible"
    >
      <motion.path
        d="M160 40 C 90 70, 55 150, 70 230 C 85 305, 140 350, 160 360 C 180 350, 235 305, 250 230 C 265 150, 230 70, 160 40 Z"
        stroke="var(--color-primary)"
        strokeWidth="1.5"
        fill="var(--color-secondary)"
        variants={draw(0)}
      />
      <motion.path
        d="M160 55 L 160 345"
        stroke="var(--color-primary)"
        strokeWidth="1.5"
        variants={draw(0.6)}
      />
      <motion.path
        d="M160 100 C 130 110, 110 130, 100 150"
        stroke="var(--color-primary)"
        strokeWidth="1.2"
        variants={draw(0.9)}
      />
      <motion.path
        d="M160 150 C 190 160, 210 180, 220 200"
        stroke="var(--color-primary)"
        strokeWidth="1.2"
        variants={draw(1.0)}
      />
      <motion.path
        d="M160 200 C 130 212, 112 234, 102 256"
        stroke="var(--color-primary)"
        strokeWidth="1.2"
        variants={draw(1.1)}
      />
      <motion.path
        d="M160 260 C 188 270, 206 290, 214 308"
        stroke="var(--color-primary)"
        strokeWidth="1.2"
        variants={draw(1.2)}
      />
      <motion.circle
        cx="160"
        cy="45"
        r="4"
        fill="var(--color-accent)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.4, ease: "easeOut" }}
      />
    </motion.svg>
  );
}