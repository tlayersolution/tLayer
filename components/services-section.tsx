"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Code2, LayoutDashboard, Bot, ShieldCheck } from "lucide-react";
import TiltCard from "./tilt-card";
import { useCustomCursor } from "./custom-cursor";

const services = [
  {
    icon: Code2,
    title: "Desarrollo Web Full-Stack & Arquitectura Escalable",
    description:
      "Desarrollamos ecosistemas digitales completos, no simples páginas web. Utilizamos React, Node.js y Python para crear Single Page Applications (SPA) y Progressive Web Apps (PWA) que se comportan como software nativo.",
    details: [
      "Server-Side Rendering (SSR) para SEO crítico",
      "Optimización de latencia y throughput",
      "Código optimizado línea por línea",
    ],
    image: "https://i.postimg.cc/J7JSmBFw/Chat-GPT-Image-13-dic-2025-10-05-40-p-m.png",
  },
  {
    icon: LayoutDashboard,
    title: "Sistemas de Gestión (ERP/CRM) a Medida",
    description:
      "Su empresa tiene flujos de trabajo únicos que el software genérico no puede cubrir. Diseñamos dashboards operativos y sistemas de gestión de recursos empresariales que se integran perfectamente con su lógica de negocio existente.",
    details: ["Centralización de datos", "Reportes en tiempo real", "Control total sobre sus operaciones"],
    image: "https://i.postimg.cc/TPDkqS41/Chat-GPT-Image-24-dic-2025-11-47-12-a-m.png",
  },
  {
    icon: Bot,
    title: "Automatización & Bots Inteligentes",
    description:
      "Implementamos agentes conversacionales avanzados para WhatsApp Business API e Instagram. No son simples árboles de decisión; integramos procesamiento de lenguaje natural (NLP) para gestionar atención al cliente, ventas automatizadas y filtrado de leads 24/7.",
    details: [
      "Conexión directa a base de datos",
      "Actualización de inventario en tiempo real",
      "Gestión automatizada de citas",
    ],
    image: "https://i.postimg.cc/PrQcvnhS/Chat-GPT-Image-13-dic-2025-10-05-45-p-m.png",
  },
  {
    icon: ShieldCheck,
    title: "Infraestructura Segura & Cumplimiento PCI",
    description:
      "La seguridad no es una característica opcional. Desarrollamos entornos preparados para transacciones financieras seguras, cumplimiento de normativas PCI DSS para manejo de tarjetas de crédito y auditoría de vulnerabilidades.",
    details: [
      "Protección contra SQL Injection y XSS",
      "Defensa ante ataques DDoS",
      "Arquitecturas robustas en la nube",
    ],
    image: "https://i.postimg.cc/PqF049hW/Chat-GPT-Image-24-dic-2025-12-38-16-p-m.png",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function ServicesSection() {
  const { setCursorVariant } = useCustomCursor();
  return (
    <motion.section
      id="servicios"
      className="relative py-32 bg-secondary/20 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-20"
          variants={itemVariants}
        >
          <span className="inline-block text-sm font-medium text-cyan-400 tracking-wider uppercase mb-4">
            High-Performance Solutions
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 text-balance">
            Servicios
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Soluciones de ingeniería diseñadas para escalar con su negocio
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="space-y-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className={`grid lg:grid-cols-2 gap-12 items-center`}
              variants={itemVariants}
            >
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="inline-flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground text-balance">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image/Visual */}
              <div
                className={`${index % 2 === 1 ? "lg:order-1" : ""}`}
                onMouseEnter={() => setCursorVariant("magnetic")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <TiltCard className="aspect-[4/3]">
                  {service.image ? (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-secondary/50 border border-border/50">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-cyan-400/5 via-blue-500/10 to-indigo-600/5 border border-border/50 flex items-center justify-center">
                      <service.icon className="w-24 h-24 text-cyan-400/20" />
                    </div>
                  )}
                </TiltCard>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
