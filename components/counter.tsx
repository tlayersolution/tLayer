"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type CounterProps = {
  from: number;
  to: number;
  suffix?: string;
  prefix?: string;
  className?: string;
};

const Counter = ({ from, to, suffix = "", prefix = "", className }: CounterProps) => {
  const nodeRef = useRef<span>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(from, to, {
      duration: 2.5, // Slightly longer for a more "premium" feel
      ease: [0.22, 1, 0.36, 1], // Custom bezier for a smooth "tech" ease-out
      onUpdate(value) {
        node.textContent = prefix + Math.round(value).toLocaleString("en-US") + suffix;
      },
    });

    return () => controls.stop();
  }, [from, to, isInView, prefix, suffix]);

  return (
    <span
      ref={nodeRef}
      className={cn("font-mono font-bold tracking-tight", className)}
      aria-label={`${prefix}${to}${suffix}`}
      role="status"
    >
      {prefix}{from}{suffix}
    </span>
  );
};

export default Counter;