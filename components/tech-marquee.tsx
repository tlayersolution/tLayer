"use client";

import { motion } from "framer-motion";
import {
  Code,
  Database,
  GitBranch,
  Cloud,
  Terminal,
  Cpu,
  Feather,
  Figma,
} from "lucide-react";

const techLogos = [
  { icon: Code, name: "React" },
  { icon: Database, name: "Node.js" },
  { icon: GitBranch, name: "Git" },
  { icon: Cloud, name: "AWS" },
  { icon: Terminal, name: "Docker" },
  { icon: Cpu, name: "Python" },
  { icon: Feather, name: "Next.js" },
  { icon: Figma, name: "Figma" },
];

const marqueeVariants = {
  animate: {
    x: ["0%", "-100%"],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 30,
        ease: "linear",
      },
    },
  },
};

export function TechMarquee() {
  const allLogos = [...techLogos, ...techLogos]; // Duplicate for seamless loop

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-12 px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground">
          Tecnologías que Potencian Nuestras Soluciones
        </h2>
      </div>
      <motion.div
        className="w-full flex"
        whileHover={{ paused: true }}
      >
        <motion.div
          className="flex flex-shrink-0"
          variants={marqueeVariants}
          animate="animate"
        >
          {allLogos.map((tech, index) => (
            <div
              key={index}
              className="flex items-center justify-center w-64 h-24 p-8 mx-4 rounded-2xl bg-secondary/30 border border-border/50"
            >
              <tech.icon className="w-10 h-10 text-muted-foreground" />
              <span className="ml-4 text-foreground font-medium">{tech.name}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
