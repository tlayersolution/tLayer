"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "@/components/preloader";
import { CursorProvider } from "@/components/custom-cursor";
import { Analytics } from "@vercel/analytics/next";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <Preloader onComplete={() => setIsLoading(false)} />
      ) : (
        <CursorProvider>
          {children}
          <Analytics />
        </CursorProvider>
      )}
    </AnimatePresence>
  );
}
