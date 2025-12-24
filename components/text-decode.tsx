"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface TextDecodeProps {
  text: string;
  className?: string;
  delay?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?";

export function TextDecode({ text, className, delay = 0 }: TextDecodeProps) {
  const [displayText, setDisplayText] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isInView && !isAnimating) {
      setIsAnimating(true);
      let iteration = 0;
      const maxIterations = 10; // How many scrambles per letter
      
      // Initial delay
      const startTimeout = setTimeout(() => {
        const interval = setInterval(() => {
          setDisplayText((current) =>
            text
              .split("")
              .map((letter, index) => {
                if (index < iteration) {
                  return text[index];
                }
                return CHARS[Math.floor(Math.random() * CHARS.length)];
              })
              .join("")
          );

          if (iteration >= text.length) {
            clearInterval(interval);
          }

          iteration += 1 / 2; // Speed of reveal (lower is slower)
        }, 30);

        return () => clearInterval(interval);
      }, delay * 1000);

      return () => clearTimeout(startTimeout);
    }
  }, [isInView, text, delay, isAnimating]);

  return (
    <span ref={ref} className={className}>
      {displayText || text.split("").map(() => " ").join("")} 
      {/* Render spaces initially to hold layout */}
    </span>
  );
}
