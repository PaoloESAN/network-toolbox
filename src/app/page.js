"use client"

import React, { useState } from "react"
import { ModeToggle } from "@/components/theme-toogle"
import IPv4IPv6Converter from "@/components/IPv4IPv6Converter"
import IPv4IPv6Badge3D from "@/components/IPv4IPv63D"
import DockNav from "@/components/DockNav"
import gsap from "gsap"
import Prism from "@/components/Prism"

export default function Home() {
  const [isIPv4, setIsIPv4] = useState(true)
  const containerRef = React.useRef(null)

  React.useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('[data-animate]')
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
        }
      )
    }
  }, [])

  return (
    <>
      {/* Fondo animado */}
      <div className="absolute inset-0 -z-10">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.6}
          baseWidth={3.5}
          scale={3.5}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>

      {/* Dock Navigation */}
      <DockNav />

      {/* Botón de tema */}
      <div className="fixed top-6 right-6 z-50">
        <ModeToggle />
      </div>

      {/* Contenedor principal */}
      <div ref={containerRef} className="relative z-10 w-full h-screen overflow-hidden flex flex-col">

        <div className="flex flex-1 items-center justify-between px-8 md:px-16 gap-12">

          {/* Sección izquierda */}
          <div className="flex-1 max-w-2xl">
            {/* Título principal */}
            <div className="mb-12" data-animate>
              <div className="inline-block mb-4">
                <span className="text-xs font-bold px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary">
                  Herramienta de Redes
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-4">
                Convertidor de IPs
              </h1>
              <p className="text-muted-foreground mt-4 text-lg">
                Convierte fácilmente entre direcciones IPv4 e IPv6 con validación en tiempo real
              </p>
            </div>

            {/* Card*/}
            <div className="backdrop-blur-xl bg-background/40 border border-primary/20 rounded-2xl p-8 shadow-2xl hover:border-primary/40"
              data-animate
              style={{
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)',
              }}>
              <IPv4IPv6Converter cambiarIp={setIsIPv4} />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4" data-animate>
              <div className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-4">
                <div className="text-xs font-semibold text-primary mb-1">IPv4</div>
                <div className="text-sm text-muted-foreground">32 bits, 4 octetos</div>
              </div>
              <div className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-4">
                <div className="text-xs font-semibold text-primary mb-1">IPv6</div>
                <div className="text-sm text-muted-foreground">128 bits, notación hexadecimal</div>
              </div>
            </div>
          </div>

          {/* 3D */}
          <div className="flex-1 hidden lg:block relative h-full">
            <div className="relative w-full h-full flex items-center justify-center" data-animate>
              <div className="absolute inset-0 blur-3xl animate-pulse"></div>
              <div className="relative z-10 w-full h-full">
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 -skew-x-12 translate-x-full group-hover:translate-x-0 transition-all duration-1000" />
                  <IPv4IPv6Badge3D isIPv4={isIPv4} />

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
