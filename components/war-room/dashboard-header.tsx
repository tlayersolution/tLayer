"use client";

import { useEffect, useState } from "react";
import { Clock, Globe, Shield } from "lucide-react";
import TiltCard from "@/components/tilt-card";

export function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const argentinaTime = currentTime
    ? currentTime.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "America/Argentina/Buenos_Aires",
      })
    : "--:--:--";

  const utcTime = currentTime
    ? currentTime.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "UTC",
      })
    : "--:--:--";

  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.25em] text-cyan-300">
          <Shield className="h-4 w-4" />
          War Room 2.0
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-cyan-50 md:text-4xl">
          Mission Control
        </h1>
        <p className="max-w-xl font-mono text-sm text-cyan-100/70">
          Sistema de gestión centralizado. Operaciones, Inteligencia y Tesorería en tiempo real.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TiltCard className="h-full max-w-xs">
          <div className="flex h-full flex-col justify-between rounded-xl border border-cyan-500/40 bg-black/70 px-4 py-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300">
                <Clock className="h-4 w-4" />
                <span>System Clock</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-emerald-300">SYNC</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] text-cyan-100/80">
              <div>
                <div className="text-cyan-400/80">AR TIME</div>
                <div className="text-sm">{argentinaTime}</div>
              </div>
              <div>
                <div className="text-cyan-400/80">UTC</div>
                <div className="text-sm">{utcTime}</div>
              </div>
            </div>
          </div>
        </TiltCard>

        <TiltCard className="h-full max-w-xs">
          <div className="flex h-full flex-col justify-between rounded-xl border border-cyan-500/40 bg-black/70 px-4 py-3 font-mono text-xs">
            <div className="flex items-center justify-between text-cyan-300">
              <Globe className="h-4 w-4" />
              <span>Network Status</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-cyan-100/80">
              <span>DB CONNECTION</span>
              <span className="text-emerald-400">ESTABLISHED</span>
            </div>
            <div className="mt-2 text-[10px] text-cyan-400/70">
              Todos los sistemas nominales.
            </div>
          </div>
        </TiltCard>
      </div>
    </header>
  );
}
