"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { ParticleField } from "@/components/particle-field";
import FloatingLabelInput from "@/components/floating-label-input";
import { HoloTerminal } from "@/components/holo-terminal";
import { BiometricScanner } from "@/components/biometric-scanner";

type GatekeeperPhase = "scanning" | "ready";

interface TerminalLog {
  text: string;
  variant?: "default" | "success" | "error";
}

export default function GatekeeperPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<GatekeeperPhase>("scanning");
  const [email, setEmail] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUnauthorizedOverlay, setShowUnauthorizedOverlay] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    { text: "> booting gatekeeper_module..." },
    { text: "> awaiting biometric sequence..." },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("ready");
      setTerminalLogs((previous) => [
        ...previous,
        { text: "> biometric_scan complete [OK]", variant: "success" },
        { text: "> waiting for access_key_input..." },
      ]);
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting || phase !== "ready") return;

    const expectedKey = process.env.NEXT_PUBLIC_GATEKEEPER_KEY;
    const trimmedKey = accessKey.trim();
    const trimmedEmail = email.trim();

    const attemptLog: TerminalLog = {
      text: `> incoming_connection from 127.0.0.1 :: email="${trimmedEmail || "EMPTY"}" :: key="${trimmedKey || "EMPTY"}"`,
    };

    setIsSubmitting(true);
    setTerminalLogs((previous) => [...previous, attemptLog]);

    if (!expectedKey || trimmedKey !== expectedKey) {
      setTerminalLogs((previous) => [
        ...previous,
        { text: "> AUTH_FAILURE :: UNAUTHORIZED_ACCESS_DETECTED", variant: "error" },
      ]);
      setShowUnauthorizedOverlay(true);
      setTimeout(() => {
        setShowUnauthorizedOverlay(false);
        setIsSubmitting(false);
      }, 900);
      return;
    }

    setTerminalLogs((previous) => [
      ...previous,
      { text: "> AUTH_SUCCESS :: ACCESS_GRANTED", variant: "success" },
    ]);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("tlayersolution_gatekeeper", "granted");
    }
    setTimeout(() => {
      router.push("/war-room");
    }, 600);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-cyan-50">
      <div className="absolute inset-0">
        <ParticleField />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.25em] text-cyan-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                The Gatekeeper
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-cyan-50 md:text-4xl lg:text-5xl">
                Restricted Operations Console
              </h1>
              <p className="max-w-xl font-mono text-sm text-cyan-100/70 md:text-base">
                Solo personal autorizado. Todo acceso queda registrado. Un fallo en la clave desencadena protocolos
                de defensa automáticos.
              </p>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {phase === "scanning" ? (
                  <motion.div
                    key="scanner"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.4 }}
                  >
                    <BiometricScanner />
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6 rounded-2xl border border-cyan-500/40 bg-black/70 px-6 py-8 shadow-[0_0_40px_-12px_rgba(6,182,212,0.6)]"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-cyan-300">
                        <ShieldCheck className="h-4 w-4" />
                        Access Key Required
                      </div>
                      <p className="text-[11px] font-mono text-cyan-100/70">
                        Ingresa tu clave maestra para desplegar el War Room.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <FloatingLabelInput
                        id="email"
                        type="email"
                        label="EMAIL"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                      <FloatingLabelInput
                      id="access_key"
                      type="password"
                      label="ACCESS_KEY"
                      autoComplete="off"
                      value={accessKey}
                      onChange={(event) => setAccessKey(event.target.value)}
                    />
                    </div>
                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        accessKey.trim().length === 0 ||
                        email.trim().length === 0
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_30px_-10px_rgba(6,182,212,0.8)] transition-all hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? "Validando..." : "Deploy War Room"}
                    </button>
                    <p className="text-right text-[10px] font-mono text-cyan-100/60">
                      Todas las acciones son registradas en tiempo real.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-6">
            <div className="mb-1 text-xs font-mono uppercase tracking-[0.25em] text-cyan-300/80">
              Connection Logs
            </div>
            <HoloTerminal statusLabel="Gatekeeper Node: ONLINE" logs={terminalLogs} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showUnauthorizedOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-20 flex items-center justify-center bg-red-900"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <ShieldAlert className="h-14 w-14 text-red-200" />
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-[0.3em] text-red-200/80">
                  UNAUTHORIZED_ACCESS_DETECTED
                </div>
                <p className="text-xs font-mono text-red-100/80">
                  El intento de acceso ha sido registrado y bloqueado.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
