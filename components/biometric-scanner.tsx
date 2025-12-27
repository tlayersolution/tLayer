"use client";

import { motion } from "framer-motion";
import { Fingerprint } from "lucide-react";

interface BiometricScannerProps {
  label?: string;
}

export function BiometricScanner({ label = "BIOMETRIC ACCESS SCAN" }: BiometricScannerProps) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-cyan-500/40 bg-black/70 px-8 py-10 shadow-[0_0_40px_-12px_rgba(6,182,212,0.6)]">
      <div className="text-xs font-mono tracking-[0.3em] text-cyan-400 uppercase">
        {label}
      </div>
      <div className="relative flex h-40 w-40 items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border border-cyan-500/40"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border border-cyan-500/60"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-8 rounded-full bg-cyan-500/10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          animate={{ y: ["-40px", "40px", "-40px"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
        <Fingerprint className="relative h-16 w-16 text-cyan-300" />
      </div>
      <motion.div
        className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-300/80"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      >
        SCANNING...
      </motion.div>
    </div>
  );
}

