"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { FluidCanvas } from "./fluid-canvas";
import { ArrowDown, Terminal } from "lucide-react";
import { useCustomCursor } from "./custom-cursor";
import MagneticButton from "./magnetic-button";
import { HoloTerminal } from "./holo-terminal";
import { TextDecode } from "./text-decode";
import { ParticleField } from "./particle-field";

export function HeroSection() {
  const { setCursorVariant } = useCustomCursor();
  const heroRef = useRef<HTMLDivElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  return (
    <motion.section
      id="inicio"
      ref={heroRef}
      className="relative min-h-[95vh] flex items-center overflow-hidden pt-32 pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        <FluidCanvas />
        <ParticleField />
        {/* Blueprint Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background" />
      </div>

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full"
        variants={containerVariants}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Content */}
          <motion.div 
            className="space-y-8 text-center lg:text-left order-2 lg:order-1"
            variants={containerVariants}
          >
            {/* Terminal Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider"
              variants={itemVariants}
            >
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <TextDecode text="ENGINEERING THE FUTURE" delay={0.5} />
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
              variants={itemVariants}
            >
              <div className="flex flex-wrap gap-x-3 justify-center lg:justify-start">
                <TextDecode text="Construimos" />
                <TextDecode text="la" delay={0.2} />
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 block mt-2">
                 <TextDecode text="Capa Fundamental" delay={0.5} />
              </span> 
              <div className="mt-2">
                 <TextDecode text="de su Negocio Digital" delay={0.8} />
              </div>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground leading-relaxed"
              variants={itemVariants}
            >
              No solo creamos interfaces; diseñamos arquitecturas resilientes, 
              sistemas escalables y código puro para empresas que no se conforman con lo superficial.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
              variants={itemVariants}
            >
              <MagneticButton
                href="#contacto"
                className="group w-full sm:w-auto px-8 py-4 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.6)]"
              >
                <TextDecode text="Iniciar Proyecto" delay={1.2} />
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </MagneticButton>
              <a
                href="#filosofia"
                className="w-full sm:w-auto px-8 py-4 text-cyan-100/80 font-medium rounded-lg border border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300 text-center backdrop-blur-sm"
                onMouseEnter={() => setCursorVariant("link")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <TextDecode text="Explorar" delay={1.4} />
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Holo Terminal */}
          <motion.div 
            className="order-1 lg:order-2 flex justify-center lg:justify-end perspective-1000"
            variants={itemVariants}
            animate={{ 
              y: [0, -20, 0],
              rotateZ: [0, 1, -1, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <HoloTerminal />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cyan-500/40 text-xs uppercase tracking-widest"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span>Scroll System</span>
        <ArrowDown className="w-4 h-4" />
      </motion.div>

      {/* Side Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
        <div className="absolute top-0 left-0 w-1/6 h-full bg-gradient-to-r from-background to-transparent" />
        <div className="absolute top-0 right-0 w-1/6 h-full bg-gradient-to-l from-background to-transparent" />
      </div>
    </motion.section>
  );
}