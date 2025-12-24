"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import MorphingCross from "./morphing-cross"
import { OffCanvasMenu } from "./off-canvas-menu"

const navItems = [
  { label: "Filosofía", href: "#filosofia" },
  { label: "Servicios", href: "#servicios" },
  { label: "Metodología", href: "#metodologia" },
  { label: "Contacto", href: "#contacto" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#inicio" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                <Image
                  src="https://i.postimg.cc/Dfd5BQDS/Chat-GPT-Image-13-dic-2025-10-09-18-p-m.png"
                  alt="Truelayer Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-foreground font-semibold text-lg tracking-tight">
                Truelayer
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contacto"
                className="ml-4 px-5 py-2.5 text-sm font-medium bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-all duration-300"
              >
                Iniciar Proyecto
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <MorphingCross
                isOpen={isMobileMenuOpen}
                setIsOpen={setIsMobileMenuOpen}
              />
            </div>
          </div>
        </div>
      </header>
      <OffCanvasMenu
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />
    </>
  )
}
