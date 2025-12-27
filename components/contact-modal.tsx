"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageSquare } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCustomCursor } from "./custom-cursor";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { scale: 0.9, opacity: 0, y: 50 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
    },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    y: 50,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { setCursorVariant } = useCustomCursor();
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await addDoc(collection(db, "leads"), {
        message: message.trim(),
        source: "contact_modal",
        status: "new",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error al registrar lead en Firestore", error);
    }

    const phoneNumber = "5491137725766";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    onClose();
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Chat Widget Modal */}
          <motion.div
            className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="bg-secondary/50 p-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Soporte Truelayer</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    En línea
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
                onMouseEnter={() => setCursorVariant("link")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-background/50 p-4 overflow-y-auto space-y-4">
              {/* System Message */}
              <div className="flex justify-center">
                <span className="text-xs text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full">
                  Hoy
                </span>
              </div>

              {/* Bot Message */}
              <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex-shrink-0 flex items-center justify-center mt-1">
                  <span className="font-bold text-xs text-cyan-400">TL</span>
                </div>
                <div className="bg-secondary/50 p-3 rounded-2xl rounded-tl-none max-w-[80%] border border-border/50">
                  <p className="text-sm text-foreground">
                    ¡Hola! 👋 Gracias por tu interés. ¿Cuéntanos en qué podemos ayudarte con tu próximo proyecto?
                  </p>
                  <span className="text-[10px] text-muted-foreground mt-1 block text-right">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-card border-t border-border">
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  className="w-full bg-secondary/30 text-foreground rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-none h-14 scrollbar-hide"
                  style={{ minHeight: "56px" }}
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="absolute right-2 bottom-2 p-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onMouseEnter={() => setCursorVariant("link")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Serás redirigido a WhatsApp para continuar.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
