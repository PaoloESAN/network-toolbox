"use client"

import React, { useState, useRef } from 'react'

export default function DockNav() {
    const [isHovered, setIsHovered] = useState(false)
    const timeoutRef = useRef(null)

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsHovered(false)
        }, 150)
    }

    return (
        <div
            className="fixed top-0 left-0 right-0 z-30 pointer-events-none"
            style={{ height: '100px' }}
        >
            {/* Área invisible para hover */}
            <div
                className="absolute w-220 top-0 left-1/2 -translate-x-1/2 pointer-events-auto"
                style={{ height: '70px' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />

            {/* Dock Badge */}
            <div
                className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto backdrop-blur-2xl bg-background/70 border border-primary/30 rounded-2xl shadow-2xl transition-all duration-300"
                style={{
                    opacity: isHovered ? 1 : 0.3,
                    transform: isHovered ? 'translate(0%, 0px)' : 'translate(0%, calc(-100% + 4px))',
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)',
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex items-center gap-1 px-2 py-2">
                    {/* Convertidor de IPs */}
                    <button
                        className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl hover:bg-primary/15 transition-all duration-200"
                    >
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            Convertidor de IPs
                        </div>
                    </button>

                    {/* Separador */}
                    <div className="w-px h-6 bg-primary/20" />

                    {/* Máscaras de IP */}
                    <button
                        className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl hover:bg-primary/15 transition-all duration-200"
                    >
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            Máscaras de IP
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
