"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorContextType = {
  setCursorVariant: (variant: "default" | "link" | "magnetic") => void;
};

const CursorContext = createContext<CursorContextType | null>(null);

export const CursorProvider = ({ children }: { children: React.ReactNode }) => {
  const [cursorVariant, setCursorVariant] = useState<
    "default" | "link" | "magnetic"
  >("default");

  return (
    <CursorContext.Provider value={{ setCursorVariant }}>
      {children}
      <CustomCursor cursorVariant={cursorVariant} />
    </CursorContext.Provider>
  );
};

export const useCustomCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCustomCursor must be used within a CursorProvider");
  }
  return context;
};

const CustomCursor = ({
  cursorVariant,
}: {
  cursorVariant: "default" | "link" | "magnetic";
}) => {
  // Raw cursor position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring for the "follower" (aesthetic ring)
  const springConfig = {
    damping: 30, // Increased damping for smoother, more stable movement
    stiffness: 250,
    mass: 0.5,
  };
  
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorX, cursorY]);

  const variants = {
    default: {
      width: 32,
      height: 32,
      opacity: 0.4,
      border: "1px solid rgba(255, 255, 255, 0.5)",
      backgroundColor: "transparent",
    },
    link: {
      width: 60,
      height: 60,
      opacity: 0.6,
      border: "1px solid rgba(6, 182, 212, 0.5)", // Cyan border
      backgroundColor: "rgba(6, 182, 212, 0.05)",
    },
    magnetic: {
      width: 80,
      height: 80,
      opacity: 0.8,
      border: "2px solid rgba(6, 182, 212, 0.8)",
      backgroundColor: "rgba(6, 182, 212, 0.1)",
    },
  };

  return (
    /* Only the Follower - The real mouse pointer is now visible for speed and reliability */
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[199] mix-blend-screen will-change-transform"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      variants={variants}
      animate={cursorVariant}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 30,
        mass: 0.5
      }}
    />
  );
};