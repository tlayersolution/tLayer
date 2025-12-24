"use client";

import { motion } from "framer-motion";

export function SectionSeparator() {
  return (
    <div className="relative h-40 w-full overflow-hidden bg-transparent">
      <motion.svg
        className="absolute -bottom-1 left-0 w-full h-auto"
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M1440 120H0V26.2941C159.23 48.3399 329.487 58.948 479.239 56.4468C728.322 52.2057 918.026 -1.05405 1175.29 26.2941C1306.49 40.2337 1440 82.3529 1440 120Z"
          fill="oklch(0.07 0.01 260)" // Matches --background from globals.css
        />
      </motion.svg>
    </div>
  );
}
