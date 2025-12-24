"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MorphingCrossProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MorphingCross = ({ isOpen, setIsOpen }: MorphingCrossProps) => {
  const variants = {
    opened: {
      rotate: 45,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    closed: {
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <motion.button
      onClick={() => setIsOpen(!isOpen)}
      className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-800/50 backdrop-blur-sm"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={isOpen ? "opened" : "closed"}
    >
      <motion.div
        className="absolute w-6 h-0.5 bg-white"
        style={{ top: "40%" }}
        variants={variants}
      />
      <motion.div
        className="absolute w-6 h-0.5 bg-white"
        style={{ top: "60%" }}
        variants={variants}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute w-6 h-0.5 bg-white"
            style={{ rotate: -90 }}
          >
            <motion.div
              className="absolute w-6 h-0.5 bg-white"
              style={{ rotate: 90 }}
              variants={{
                opened: {
                  rotate: -45,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  },
                },
                closed: {
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  },
                },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default MorphingCross;