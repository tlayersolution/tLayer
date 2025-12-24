"use client";

import { motion } from "framer-motion";
import { useCustomCursor } from "./custom-cursor";

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const AnimatedLink = ({ href, children, className }: AnimatedLinkProps) => {
  const { setCursorVariant } = useCustomCursor();

  return (
    <motion.a
      href={href}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setCursorVariant("link")}
      onMouseLeave={() => setCursorVariant("default")}
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-[1px] bg-cyan-400"
        style={{ originX: 0 }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: [0.6, 0.05, -0.01, 0.9] }}
      />
    </motion.a>
  );
};
