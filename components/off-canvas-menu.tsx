"use client"

import {
  ChevronRight,
  Folder,
  Home,
  Mail,
  Users,
  X,
  Zap,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface OffCanvasMenuProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const navItems = [
  { label: "Inicio", href: "#", icon: Home },
  { label: "Servicios", href: "#servicios", icon: Zap },
  { label: "Proyectos", href: "#proyectos", icon: Folder },
  { label: "Sobre Nosotros", href: "#nosotros", icon: Users },
  { label: "Contacto", href: "#contacto", icon: Mail },
]

export function OffCanvasMenu({ isOpen, setIsOpen }: OffCanvasMenuProps) {
  const menuVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      x: "100%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-screen w-full max-w-sm bg-black/80 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Menú</h2>
                <p className="text-sm text-gray-400">
                  Navega por nuestro sitio
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                aria-label="Cerrar menú"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <nav className="flex-grow p-6 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-4 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={20} />
                    <span className="text-lg">{item.label}</span>
                  </div>

                  <ChevronRight size={20} />
                </a>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 text-center">
              <div className="flex justify-center gap-4 mb-4">
                {["T", "G", "L"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                  >
                    {social}
                  </a>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                © 2025 Truelayer. Todos los derechos reservados.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}