"use client";

import { useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { useCustomCursor } from "./custom-cursor";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

const MagneticButton = ({ children, className, href, onClick }: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { setCursorVariant } = useCustomCursor();

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);
    const pullFactor = 0.4;
    if (distance < width * 1.5) {
        x.set((mouseX - centerX) * pullFactor);
        y.set((mouseY - centerY) * pullFactor);
    } else {
        x.set(0);
        y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setCursorVariant("default");
  };
  
  const handleClick = () => {
    if (href) {
      window.location.href = href;
    }
    if (onClick) {
      onClick();
    }
  };

  const shimmerVariants = {
    animate: {
      x: ["-100%", "200%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 2,
          ease: "linear",
          delay: 3,
          repeatDelay: 5,
        },
      },
    },
  };

  return (
    <motion.button
      ref={ref}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setCursorVariant("magnetic")}
      style={{ x, y }}
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
    >
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
            transform: "skewX(-20deg)"
        }}
        variants={shimmerVariants}
        animate="animate"
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default MagneticButton;
