"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, MapPin, Shield, Bot, Code2 } from "lucide-react";
import MagneticButton from "./magnetic-button";
import { AnimatedLink } from "./animated-link";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function Footer({ onContactClick }: { onContactClick: () => void }) {
  return (
    <motion.footer
      id="contacto"
      className="relative bg-secondary/20 border-t border-border/50"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-500/10 to-indigo-600/5" />
        <motion.div
          className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            ¿Listo para construir algo{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              extraordinario
            </span>
            ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Hablemos sobre su próximo proyecto. Sin compromiso, sin plantillas, solo soluciones reales.
          </p>
          <MagneticButton
            onClick={onContactClick}
            className="group px-8 py-4 bg-foreground text-background font-medium rounded-xl hover:bg-foreground/90 transition-all duration-300 flex items-center gap-2"
          >
            <Mail size={18} />
            Iniciar Conversación
          </MagneticButton>
        </motion.div>
      </div>

      {/* Footer Content */}
      <div className="relative border-t border-border/50">
        {/* Placeholder Map Background */}
        <div className="absolute inset-0 opacity-50">
          {/* This is a placeholder for the stylized Quilmes map. 
              Using a subtle grid pattern for now to match the aesthetic. */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <motion.div
            className="grid md:grid-cols-4 gap-12"
            variants={containerVariants}
          >
            {/* Brand */}
            <motion.div className="md:col-span-2 space-y-6" variants={itemVariants}>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                  {/* Assuming a more abstract logo for the footer */}
                   <Image
                    src="https://i.postimg.cc/Dfd5BQDS/Chat-GPT-Image-13-dic-2025-10-09-18-p-m.png"
                    alt="Truelayer Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-foreground font-semibold text-lg">Truelayer</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-sm">
                Truelayer Development. Ingeniería de Software de alta gama para empresas que demandan excelencia
                técnica.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} className="text-cyan-400" />
                Quilmes, Buenos Aires
              </div>
            </motion.div>

            {/* Services */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h4 className="text-foreground font-semibold">Servicios</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Code2 size={14} className="text-cyan-400" />
                  Ingeniería de Software
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield size={14} className="text-cyan-400" />
                  Ciberseguridad
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bot size={14} className="text-cyan-400" />
                  Automatización
                </li>
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h4 className="text-foreground font-semibold">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <AnimatedLink href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Términos de Servicio
                  </AnimatedLink>
                </li>
                <li>
                  <AnimatedLink href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Política de Privacidad
                  </AnimatedLink>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-border/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <p className="text-center text-xs text-muted-foreground">
              Código propietario. Derechos Reservados © {new Date().getFullYear()} Truelayer Development.
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
