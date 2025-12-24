"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { PhilosophySection } from "@/components/philosophy-section";
import { ServicesSection } from "@/components/services-section";
import { MethodologySection } from "@/components/methodology-section";
import { TechMarquee } from "@/components/tech-marquee";
import { Footer } from "@/components/footer";
import { SectionSeparator } from "@/components/section-separator";
import { ContactModal } from "@/components/contact-modal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SectionSeparator />
      <PhilosophySection />
      <SectionSeparator />
      <ServicesSection />
      <SectionSeparator />
      <MethodologySection />
      <TechMarquee />
      <Footer onContactClick={() => setIsModalOpen(true)} />
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
