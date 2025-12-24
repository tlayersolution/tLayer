"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Cpu, Cloud, Gauge, Infinity } from "lucide-react";
import TiltCard from "./tilt-card";
import { useCustomCursor } from "./custom-cursor";

const methodologyPoints = [
  {
    icon: Cpu,
    title: "Análisis Técnico",
    description: "Analizamos su requerimiento técnico y diseñamos la solución exacta",
  },
  {
    icon: Cloud,
    title: "Firebase & Serverless",
    description: "Infraestructura que escala de 10 a 10 millones de usuarios",
  },
  {
    icon: Gauge,
    title: "Alto Rendimiento",
    description: "Lazy loading, caching estratégico y bases de datos en tiempo real",
  },
  {
    icon: Infinity,
    title: "Sin Límites",
    description: "Si usted lo puede imaginar, nosotros podemos programarlo",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function MethodologySection() {
  const { setCursorVariant } = useCustomCursor();
  return (
    <motion.section
      id="metodologia"
      className="relative py-32 bg-background overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-20"
          variants={itemVariants}
        >
          <span className="inline-block text-sm font-medium text-cyan-400 tracking-wider uppercase mb-4">
            Methodology
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 text-balance">
            Nuestro Enfoque
          </h2>
          <p className="text-xl text-foreground font-medium mb-4">
            Ingeniería Agnóstica & Stack Adaptativo
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            No creemos en soluciones de talla única ni forzamos una tecnología por conveniencia. Nuestra arquitectura se
            define estrictamente por los requerimientos de su negocio. Dominamos un espectro completo de tecnologías de
            persistencia: desde la integridad transaccional robusta de PostgreSQL y SQL Server, hasta la escalabilidad
            documental de MongoDB y la sincronización en tiempo real de Firebase. Ya sea que su proyecto requiera
            microservicios en la nube, arquitecturas serverless o sistemas monolíticos optimizados, seleccionamos y
            orquestamos el stack tecnológico exacto para garantizar el máximo rendimiento, seguridad y escalabilidad
            futura. No usamos lo que está de moda; usamos lo que funciona y perdura.
          </p>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          className="grid lg:grid-cols-2 gap-16 items-center"
          variants={containerVariants}
        >
          {/* Left - Image */}
          <motion.div
            className="relative"
            variants={itemVariants}
            onMouseEnter={() => setCursorVariant("magnetic")}
            onMouseLeave={() => setCursorVariant("default")}
          >
            <TiltCard>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/50 border border-border/50">
                <Image
                  src="https://i.postimg.cc/HkWNQvkn/Chat-GPT-Image-13-dic-2025-10-05-50-p-m.png"
                  alt="Velocidad y Procesamiento"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              </div>
            </TiltCard>
            {/* Floating card */}
            <motion.div 
              className="absolute -bottom-8 -right-8 p-6 rounded-2xl bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-muted-foreground italic">
                &quot;Si usted lo puede imaginar, nosotros tenemos la capacidad matemática y lógica para
                programarlo.&quot;
              </p>
            </motion.div>
          </motion.div>

          {/* Right - Points */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <p className="text-muted-foreground leading-relaxed">
              Utilizamos <span className="text-foreground font-medium">Firebase</span> y arquitecturas{" "}
              <span className="text-foreground font-medium">Serverless</span> para garantizar que su infraestructura
              escale automáticamente desde 10 hasta 10 millones de usuarios sin intervención manual.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Priorizamos el rendimiento: optimización de assets, lazy loading, caching estratégico y bases de datos en
              tiempo real.
            </p>

            {/* Methodology Points */}
            <motion.div className="grid sm:grid-cols-2 gap-4 mt-8" variants={containerVariants}>
              {methodologyPoints.map((point) => (
                <motion.div
                  key={point.title}
                  className="group p-5 rounded-xl bg-secondary/30 border border-border/50 hover:border-cyan-400/30 transition-all duration-500"
                  variants={itemVariants}
                  onMouseEnter={() => setCursorVariant("link")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center mb-3 group-hover:bg-cyan-400/20 transition-colors">
                    <point.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h4 className="text-foreground font-semibold mb-1">{point.title}</h4>
                  <p className="text-xs text-muted-foreground">{point.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
