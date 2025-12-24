import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { PageWrapper } from "@/components/page-wrapper";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Truelayer | High-End Software Engineering",
  description:
    "Ingeniería de software a medida. Sin plantillas. Sin límites. Desarrollo web, sistemas ERP/CRM, automatización y ciberseguridad.",
  generator: "Truelayer Development",
  keywords: [
    "software engineering",
    "web development",
    "ciberseguridad",
    "automatización",
    "ERP",
    "CRM",
    "Argentina",
  ],
  authors: [{ name: "Truelayer Development" }],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <PageWrapper>{children}</PageWrapper>
      </body>
    </html>
  );
}
