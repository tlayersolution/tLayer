"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [isDrawingComplete, setIsDrawingComplete] = useState(false);

  const containerVariants = {
    initial: {
      opacity: 1,
    },
    exit: {
      translateY: "-100vh",
      transition: {
        duration: 0.8,
        ease: [0.83, 0, 0.17, 1], // Quintic ease-out
      },
    },
  };

  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  useEffect(() => {
    if (isDrawingComplete) {
      // Wait a moment after drawing before sliding up
      const timer = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isDrawingComplete, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
      variants={containerVariants}
      initial="initial"
      animate={isDrawingComplete ? "exit" : "initial"}
    >
      <motion.svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M20 80V20H50 M20 20H80V50C80 66.5685 66.5685 80 50 80H20"
          stroke="white"
          strokeWidth="4"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          onAnimationComplete={() => setIsDrawingComplete(true)}
        />
      </motion.svg>
       <motion.div
        className="absolute top-0 left-0 h-1 bg-blue-500 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2.5, ease: "linear" }}
      />
    </motion.div>
  );
};

export default Preloader;
