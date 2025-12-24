"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  id: string;
  label: string;
  as?: "input" | "textarea";
}

const FloatingLabelInput = ({ id, label, as = "input", ...props }: FloatingLabelInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  const isFloating = isFocused || value;
  const InputComponent = as === "textarea" ? motion.textarea : motion.input;

  const labelVariants = {
    initial: {
      y: "50%",
      scale: 1,
      color: "oklch(0.6 0 0)", // Muted foreground
    },
    float: {
      y: "-50%",
      scale: 0.85,
      color: "oklch(0.75 0.15 200)", // Primary color
    },
  };

  return (
    <div className="relative w-full">
      <motion.label
        htmlFor={id}
        className="absolute top-1/2 left-4 pointer-events-none origin-left"
        variants={labelVariants}
        initial="initial"
        animate={isFloating ? "float" : "initial"}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {label}
      </motion.label>
      <InputComponent
        id={id}
        {...props}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => {
            setValue(e.target.value);
            if (props.onChange) props.onChange(e);
        }}
        className={`w-full px-4 py-3 bg-secondary/30 border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${as === 'textarea' ? 'min-h-32' : ''}`}
      />
    </div>
  );
};

export default FloatingLabelInput;
