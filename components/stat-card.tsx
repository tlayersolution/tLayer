"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  delay?: number;
}

export function StatCard({ label, value, delay = 0 }: StatCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden rounded-xl border border-border/50 bg-background/50 p-8 text-center backdrop-blur-sm transition-colors hover:border-cyan-500/30 group"
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(6,182,212,0.1), transparent 40%)`,
        }}
      />
      
      {/* Border Beam / Glow that follows mouse (subtler) */}
       <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(6,182,212,0.3), transparent 40%)`,
          maskImage: `linear-gradient(black, black) content-box, linear-gradient(black, black)`,
          maskComposite: `exclude`,
          WebkitMaskComposite: `xor`, 
          padding: "1px", 
        }}
      />

      {/* Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Scanline Effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="w-full h-[2px] bg-cyan-400/50 absolute top-0 shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-scanline" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2">
         <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground group-hover:text-cyan-400 transition-colors duration-300">
          {label}
        </span>
        <div className="text-4xl md:text-5xl text-foreground font-mono font-bold tracking-tighter">
          {value}
        </div>
      </div>
    </motion.div>
  );
}
