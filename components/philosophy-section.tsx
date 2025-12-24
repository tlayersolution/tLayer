"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Shield, Database, Lock, Zap } from "lucide-react";
import Counter from "./counter";
import { useCustomCursor } from "./custom-cursor";
import { StatCard } from "./stat-card";

const features = [
  {
    icon: Shield,
    title: "Arquitectura Invisible",
    description: "La solidez del backend que sostiene su negocio",
  },
  {
    icon: Database,
    title: "Eficiencia de Datos",
    description: "Bases de datos optimizadas para máximo rendimiento",
  },
  {
    icon: Lock,
    title: "Seguridad PCI DSS",
    description: "Cumplimiento normativo para transacciones seguras",
  },
  {
    icon: Zap,
    title: "Resiliencia",
    description: "Sistemas que escalan bajo cualquier carga",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function PhilosophySection() {
  const { setCursorVariant } = useCustomCursor();
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <motion.section
      id="filosofia"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-background overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12 md:mb-20"
          variants={containerVariants}
        >
          <motion.span
            className="inline-block text-sm font-medium text-cyan-400 tracking-wider uppercase mb-4"
            variants={itemVariants}
          >
            The Core
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 text-balance"
            variants={itemVariants}
          >
            Filosofía
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground leading-relaxed"
            variants={itemVariants}
          >
            Vivimos en una era saturada de soluciones superficiales. Agencias que venden &quot;paquetes&quot;
            prefabricados, código inflado y dependencias innecesarias que comprometen la seguridad y la escalabilidad de
            su negocio.
          </motion.p>
        </motion.div>

        {/* Philosophy Content */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center"
          variants={containerVariants}
        >
          {/* Left - Text */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <p className="text-muted-foreground leading-relaxed">
              En <span className="text-foreground font-medium">Truelayer</span>, operamos bajo un paradigma diferente.
              Creemos en la arquitectura invisible: la solidez del backend, la eficiencia de la base de datos y la
              pureza del código.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              No somos diseñadores gráficos que aprendieron a programar; somos{" "}
              <span className="text-foreground font-medium">ingenieros</span> que entienden que el verdadero valor de un
              activo digital reside en su capacidad de procesamiento, su seguridad y su resiliencia bajo carga.
            </p>
            <p className="text-lg text-foreground font-medium border-l-2 border-cyan-400 pl-6 my-8">
              Construimos la capa fundamental sobre la que su negocio escalará sin fricción.
            </p>
          </motion.div>

          {/* Right - Features Grid */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-cyan-400/30 transition-all duration-500"
                variants={itemVariants}
                onMouseEnter={() => setCursorVariant("link")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-4 group-hover:bg-cyan-400/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-foreground font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <div className="mt-12 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <StatCard
            label="Años de Exp."
            value={<Counter from={0} to={10} suffix="+" />}
            delay={0.2}
          />
          <StatCard
            label="Proyectos Core"
            value={<Counter from={0} to={85} suffix="+" />}
            delay={0.4}
          />
          <StatCard
            label="Clean Commits"
            value={<Counter from={0} to={1500} suffix="+" />}
            delay={0.6}
          />
        </div>
      </div>
    </motion.section>
  );
}
