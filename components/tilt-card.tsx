"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

const TiltCard = ({ children, className }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / width;
    const y = (e.clientY - top - height / 2) / height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full h-full transform-gpu ${className}`}
    >
      <div
        style={{
          transform: "translateZ(20px)",
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full"
      >
        {children}
        {/* Spotlight Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: useTransform(
              [mouseXSpring, mouseYSpring],
              ([x, y]) =>
                `radial-gradient(400px at ${
                  typeof x === 'number' ? x * 100 + 50 : 50
                }% ${
                  typeof y === 'number' ? y * 100 + 50 : 50
                }%, rgba(3, 218, 243, 0.15), transparent 80%)`
            ),
          }}
        />
      </div>
    </motion.div>
  );
};

export default TiltCard;
