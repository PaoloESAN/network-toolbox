"use client"

import { useRouter } from 'next/navigation'
import React from 'react'

export default function DockNav() {
    const router = useRouter()
    return (
        <div
            className="fixed top-0 left-0 right-0 z-30 pointer-events-none"
            style={{ height: '100px' }}
        >
            {/* Dock Badge */}
            <div
                className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto backdrop-blur-2xl bg-background/70 border border-primary/30 rounded-2xl shadow-2xl transition-all duration-300"
            >
                <div className="flex items-center gap-1 px-2 py-2">
                    {/* Convertidor de IPs */}
                    <button
                        onClick={() => router.push('/')}
                        className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl hover:bg-primary/15 transition-all duration-200 cursor-pointer w-full"
                    >
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors w-full whitespace-nowrap">
                            Convertidor de IPs
                        </div>
                    </button>

                    {/* Separador */}
                    <div className="w-px h-6 bg-primary/20" />

                    {/* Máscaras de IP */}
                    <button
                        onClick={() => router.push('/mascaras-ip')}
                        className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl hover:bg-primary/15 transition-all duration-200 cursor-pointer w-full"
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
