"use client";

import { useState } from "react";
import { Vortex } from "@/components/ui/vortex";
import { CometCard } from "@/components/ui/comet-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DockNav from "@/components/DockNav";

const mockData = [
    { label: "Address", value: "192.168.0.1", binario: "11000000.10101000.00000000.00000001" },
    { label: "Netmask", value: "255.255.255.0 = /24", binario: "11111111.11111111.11111111.00000000" },
    { label: "Wildcard", value: "0.0.0.255", binario: "00000000.00000000.00000000.11111111" },
    { label: "Network", value: "192.168.0.0/24", binario: "11000000.10101000.00000000.00000000" },
    { label: "HostMin", value: "192.168.0.1", binario: "11000000.10101000.00000000.00000001" },
    { label: "HostMax", value: "192.168.0.254", binario: "11000000.10101000.00000000.11111110" },
    { label: "Broadcast", value: "192.168.0.255", binario: "11000000.10101000.00000000.11111111" },
    { label: "Hosts/Net", value: "254", binario: "00000000.00000000.00000000.11111110" },
];

export default function MascarasIPPage() {
    const [ip, setIp] = useState("");
    const [mascara, setMascara] = useState("");
    const [mostrarBinario, setMostrarBinario] = useState(false);

    return (
        <>
            {/* Fondo animado */}
            <div className="absolute inset-0 -z-10">
                <Vortex
                    backgroundColor="black"
                    rangeY={800}
                    particleCount={500}
                    baseHue={120}
                    className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
                />
            </div>

            {/* Dock Navigation */}
            <DockNav />

            {/* Contenedor principal */}
            <div className="relative z-10 w-full h-screen overflow-hidden flex flex-col">
                <div className="flex flex-1 items-center justify-center px-8 md:px-16 gap-12">

                    {/* Sección Izquierda - Inputs */}
                    <div className="flex-1 max-w-2xl">
                        {/* Título principal */}
                        <div className="mb-12">
                            <div className="inline-block mb-4">
                                <span className="text-xs font-bold px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary">
                                    Herramienta de Redes
                                </span>
                            </div>
                            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-foreground mb-4">
                                Calculadora de Subredes
                            </h1>
                            <p className="text-muted-foreground mt-4 text-lg">
                                Calcula fácilmente la información de tus subredes IPv4 con validación en tiempo real
                            </p>
                        </div>

                        {/* Card Principal */}
                        <div className="backdrop-blur-xl bg-background/40 border border-primary/20 rounded-2xl p-8 shadow-2xl hover:border-primary/40"
                            style={{
                                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)',
                            }}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">
                                        Dirección IP
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="192.168.0.1"
                                        value={ip}
                                        onChange={(e) => setIp(e.target.value)}
                                        className="bg-background/30 text-foreground border-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">
                                        Máscara de Red (CIDR)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="24"
                                        value={mascara}
                                        onChange={(e) => setMascara(e.target.value)}
                                        min="0"
                                        max="32"
                                        className="bg-background/30 text-foreground border-primary/20"
                                    />
                                </div>

                                <Button
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    Calcular
                                </Button>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-4">
                                <div className="text-xs font-semibold text-primary mb-1">IPv4</div>
                                <div className="text-sm text-muted-foreground">32 bits, 4 octetos</div>
                            </div>
                            <div className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-4">
                                <div className="text-xs font-semibold text-primary mb-1">Subredes</div>
                                <div className="text-sm text-muted-foreground">División de red</div>
                            </div>
                        </div>
                    </div>

                    {/* Sección Derecha - Cards Grid 3x3 Centradas */}
                    <div className="flex-1 hidden lg:flex items-center justify-center h-full">
                        <div className="grid grid-cols-3 gap-4">
                            {mockData.map((item, index) => (
                                <CometCard key={index}>
                                    <div className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-6 w-48 h-40 flex flex-col justify-between hover:border-primary/30 transition-colors">
                                        <div className="flex flex-col h-full justify-between">
                                            <div>
                                                <h3 className="text-foreground font-mono text-sm font-bold break-all line-clamp-3">
                                                    {mostrarBinario ? item.binario : item.value}
                                                </h3>
                                            </div>
                                            {/* Texto de IP en la parte inferior */}
                                            <p className="text-foreground/60 font-mono text-xs border-t border-primary/20 pt-2 mt-2">
                                                {item.label}
                                            </p>
                                        </div>
                                    </div>
                                </CometCard>
                            ))}

                            {/* Novena Card - Toggle Binario */}
                            <CometCard>
                                <div
                                    onClick={() => setMostrarBinario(!mostrarBinario)}
                                    className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-6 w-48 h-40 flex flex-col justify-center items-center hover:border-primary/30 cursor-pointer hover:bg-background/40"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        transform: mostrarBinario ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        transition: 'transform 0.6s ease-in-out',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Lado frontal - Ver Binario */}
                                    <h3
                                        className={mostrarBinario ? 'hidden' : 'text-foreground font-semibold text-sm text-center'}
                                    >
                                        Ver Binario
                                    </h3>

                                    {/* Lado trasero - Ver Decimal */}
                                    <h3
                                        className={mostrarBinario ? 'text-foreground font-semibold text-sm text-center absolute inset-0 flex items-center justify-center' : 'hidden'}
                                        style={{
                                            transform: 'rotateY(180deg)',
                                        }}
                                    >
                                        Ver Decimal
                                    </h3>
                                </div>
                            </CometCard>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
