"use client";

import { motion } from "framer-motion";
import { Activity, Lock, Server, Wifi } from "lucide-react";
import TiltCard from "./tilt-card";

interface HoloTerminalLog {
  text: string;
  variant?: "default" | "success" | "error";
}

interface HoloTerminalProps {
  logs?: HoloTerminalLog[];
  statusLabel?: string;
}

export function HoloTerminal({ logs, statusLabel = "System Status: ONLINE" }: HoloTerminalProps) {
  const lineVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
      },
    }),
  };

  const defaultLines: HoloTerminalLog[] = [
    { text: "> initializing core_modules..." },
    { text: "> loading security_protocols [AES-256]" },
    { text: "> establishing secure_handshake..." },
    { text: "> optimization complete.", variant: "success" },
  ];

  const linesToRender = logs && logs.length > 0 ? logs : defaultLines;

  return (
    <TiltCard className="aspect-square max-w-md mx-auto lg:mx-0">
      <div className="relative w-full h-full rounded-xl bg-black/80 border border-cyan-500/30 backdrop-blur-md overflow-hidden font-mono text-sm shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-cyan-950/20">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="text-xs text-cyan-400/60 uppercase tracking-widest">
            {statusLabel}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Server className="w-3 h-3" />
                <span>UPTIME</span>
              </div>
              <div className="text-xl font-bold text-cyan-400">99.99%</div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Activity className="w-3 h-3" />
                <span>LATENCY</span>
              </div>
              <div className="text-xl font-bold text-green-400">
                <span className="animate-pulse">12</span>ms
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-cyan-500/20">
            {linesToRender.map((log, index) => (
              <motion.div
                key={`${index}-${log.text}`}
                custom={index}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-2 text-xs"
              >
                <span className="text-cyan-500/50">ƒzo</span>
                <span
                  className={
                    log.variant === "success"
                      ? "text-green-400"
                      : log.variant === "error"
                      ? "text-red-400"
                      : "text-cyan-100/80"
                  }
                >
                  {log.text}
                </span>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="mt-1 h-4 w-2 bg-cyan-400/50"
            />
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-lg border border-cyan-500/20 bg-cyan-900/10 p-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-400" />
              <span className="text-xs text-cyan-300">SECURE CONNECTION</span>
            </div>
            <Wifi className="h-4 w-4 text-cyan-400 opacity-50" />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent" />
      </div>
    </TiltCard>
  );
}

