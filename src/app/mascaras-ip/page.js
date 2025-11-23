"use client";

import { useState, useEffect, useRef } from "react";
import { Vortex } from "@/components/ui/vortex";
import { CometCard } from "@/components/ui/comet-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DockNav from "@/components/DockNav";
import gsap from "gsap";

export default function MascarasIPPage() {
    const [ip, setIp] = useState("");
    const [mascara, setMascara] = useState("");
    const [mostrarBinario, setMostrarBinario] = useState(false);
    const [resultados, setResultados] = useState(null);
    const [loading, setLoading] = useState(false);
    const todoRef = useRef(null);
    const cardsRef = useRef([]);
    const animatedRef = useRef(false);

    const isValidIPv4 = (ip) => {
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipv4Regex.test(ip)) return false;

        const parts = ip.split('.');
        return parts.every(part => {
            const num = parseInt(part, 10);
            return num >= 0 && num <= 255;
        });
    };

    const callMascarasAPI = async (ip, mascara) => {
        try {
            const res = await fetch('/api/mascaras-ip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip, mascara: parseInt(mascara) }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Error en API');
            }

            return data.result;
        } catch (err) {
            console.error('Mascaras API error:', err);
            throw err;
        }
    };

    const handleCalcular = async () => {
        if (ip.trim() === '' || mascara.trim() === '') {
            setResultados(null);
            return;
        }

        if (!isValidIPv4(ip)) {
            console.log('Invalid IPv4 format');
            setResultados(null);
            return;
        }

        const mascaraNum = parseInt(mascara);
        if (mascaraNum < 0 || mascaraNum > 32) {
            console.log('Invalid netmask');
            setResultados(null);
            return;
        }

        setLoading(true);
        try {
            console.log('Calling API with:', ip, mascara);
            const result = await callMascarasAPI(ip.trim(), mascara);
            const resultadosParsed = typeof result === 'string' ? JSON.parse(result) : result;
            setResultados(resultadosParsed);
        } catch (err) {
            console.log('Calculation error:', err);
            setResultados(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (animatedRef.current) return;
        animatedRef.current = true;

        if (todoRef.current) {
            gsap.fromTo(
                todoRef.current,
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
            );
        }
        if (cardsRef.current && cardsRef.current.length > 0) {
            cardsRef.current.forEach((card, index) => {
                if (card) {
                    gsap.fromTo(
                        card,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: "back.out",
                            delay: 0.1 * index + 0.3,
                        }
                    );
                }
            });
        }
    }, []);

    return (
        <>
            {/* Fondo animado */}
            <div className="absolute inset-0 -z-10">
                <Vortex
                    backgroundColor="black"
                    rangeY={800}
                    particleCount={500}
                    baseHue={150}
                    className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
                />
            </div>

            {/* Dock Navigation */}
            <DockNav />

            {/* Contenedor principal */}
            <div className="relative z-10 w-full h-screen overflow-hidden flex flex-col">
                <div className="flex flex-1 items-center justify-center px-8 md:px-16 gap-12">

                    {/* Sección Izquierda - Inputs */}
                    <div className="flex-1 max-w-2xl" ref={todoRef}>
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
                        <Card className="backdrop-blur-lg bg-background/80 border-primary/20 hover:border-primary/40 transition-colors p-6 group">
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
                                        className="bg-transparent border-0 text-lg font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 text-foreground"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">
                                        Máscara de Red
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="24"
                                        value={mascara}
                                        onChange={(e) => setMascara(e.target.value)}
                                        min="0"
                                        max="32"
                                        className="bg-transparent border-0 text-lg font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 text-foreground"
                                    />
                                </div>

                                <Button
                                    onClick={handleCalcular}
                                    disabled={loading || ip.trim() === '' || mascara.trim() === ''}
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {loading ? 'Calculando...' : 'Calcular'}
                                </Button>
                            </div>
                        </Card>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div
                                ref={(el) => cardsRef.current.push(el)}
                                className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-4"
                            >
                                <div className="text-xs font-semibold text-primary mb-1">IPv4</div>
                                <div className="text-sm text-muted-foreground">32 bits, 4 octetos</div>
                            </div>
                            <div
                                ref={(el) => cardsRef.current.push(el)}
                                className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-4"
                            >
                                <div className="text-xs font-semibold text-primary mb-1">Subredes</div>
                                <div className="text-sm text-muted-foreground">División de red</div>
                            </div>
                        </div>
                    </div>

                    {/* Sección Derecha - Cards Grid 3x3 Centradas */}
                    <div className="flex-1 hidden lg:flex items-center justify-center h-full">
                        <div className="grid grid-cols-3 gap-4">
                            {resultados ? (
                                <>
                                    {/* Cards con datos reales */}
                                    <div ref={(el) => cardsRef.current.push(el)}>
                                        <CometCard>
                                            <div className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-6 w-48 h-40 flex flex-col justify-between hover:border-primary/30 transition-colors">
                                                <div className="flex flex-col h-full justify-between">
                                                    <div>
                                                        <h3 className="text-foreground font-mono text-sm font-bold break-all line-clamp-3">
                                                            {mostrarBinario ? resultados.address_binary : resultados.address}
                                                        </h3>
                                                    </div>
                                                    <p className="text-foreground/60 font-mono text-xs border-t border-primary/20 pt-2 mt-2">
                                                        Address
                                                    </p>
                                                </div>
                                            </div>
                                        </CometCard>
                                    </div>

                                    <div ref={(el) => cardsRef.current.push(el)}>
                                        <CometCard>
                                            <div className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-6 w-48 h-40 flex flex-col justify-between hover:border-primary/30 transition-colors">
                                                <div className="flex flex-col h-full justify-between">
                                                    <div>
                                                        <h3 className="text-foreground font-mono text-sm font-bold break-all line-clamp-3">
                                                            {mostrarBinario ? resultados.netmask_binary : resultados.netmask}
                                                        </h3>
                                                    </div>
                                                    <p className="text-foreground/60 font-mono text-xs border-t border-primary/20 pt-2 mt-2">
                                                        Netmask
                                                    </p>
                                                </div>
                                            </div>
                                        </CometCard>
                                    </div>

                                    <div ref={(el) => cardsRef.current.push(el)}>
                                        <CometCard>
                                            <div className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-6 w-48 h-40 flex flex-col justify-between hover:border-primary/30 transition-colors">
                                                <div className="flex flex-col h-full justify-between">
                                                    <div>
                                                        <h3 className="text-foreground font-mono text-sm font-bold break-all line-clamp-3">
                                                            {mostrarBinario ? resultados.wildcard_binary : resultados.wildcard}
                                                        </h3>
                                                    </div>
                                                    <p className="text-foreground/60 font-mono text-xs border-t border-primary/20 pt-2 mt-2">
                                                        Wildcard
                                                    </p>
                                                </div>
                                            </div>
                                        </CometCard>
                                    </div>

                                    <div ref={(el) => cardsRef.current.push(el)}>
                                        <CometCard>
                                            <div className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-6 w-48 h-40 flex flex-col justify-between hover:border-primary/30 transition-colors">
                                                <div className="flex flex-col h-full justify-between">
                                                    <div>
                                                        <h3 className="text-foreground font-mono text-sm font-bold break-all line-clamp-3">
                                                            {mostrarBinario ? resultados.network_binary : resultados.network}
                                                        </h3>
                                                    </div>
                                                    <p className="text-foreground/60 font-mono text-xs border-t border-primary/20 pt-2 mt-2">
                                                        Network
                                                    </p>
                                                </div>
                                            </div>
                                        </CometCard>
                                    </div>

                                    <div ref={(el) => cardsRef.current.push(el)}>
                                        <CometCard>
                                            <div className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-6 w-48 h-40 flex flex-col justify-between hover:border-primary/30 transition-colors">
                                                <div className="flex flex-col h-full justify-between">
                                                    <div>
                                                        <h3 className="text-foreground font-mono text-sm font-bold break-all line-clamp-3">
                                                            {mostrarBinario ? resultados.hostmin_binary : resultados.hostmin}
                                                        </h3>
                                                    </div>
                                                    <p className="text-foreground/60 font-mono text-xs border-t border-primary/20 pt-2 mt-2">
                                                        HostMin
                                                    </p>
                                                </div>
                                            </div>
                                        </CometCard>
                                    </div>

                                    <div ref={(el) => cardsRef.current.push(el)}>
                                        <CometCard>
                                            <div className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-6 w-48 h-40 flex flex-col justify-between hover:border-primary/30 transition-colors">
                                                <div className="flex flex-col h-full justify-between">
                                                    <div>
                                                        <h3 className="text-foreground font-mono text-sm font-bold break-all line-clamp-3">
                                                            {mostrarBinario ? resultados.hostmax_binary : resultados.hostmax}
                                                        </h3>
                                                    </div>
                                                    <p className="text-foreground/60 font-mono text-xs border-t border-primary/20 pt-2 mt-2">
                                                        HostMax
                                                    </p>
                                                </div>
                                            </div>
                                        </CometCard>
                                    </div>

                                    <div ref={(el) => cardsRef.current.push(el)}>
                                        <CometCard>
                                            <div className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-6 w-48 h-40 flex flex-col justify-between hover:border-primary/30 transition-colors">
                                                <div className="flex flex-col h-full justify-between">
                                                    <div>
                                                        <h3 className="text-foreground font-mono text-sm font-bold break-all line-clamp-3">
                                                            {mostrarBinario ? resultados.broadcast_binary : resultados.broadcast}
                                                        </h3>
                                                    </div>
                                                    <p className="text-foreground/60 font-mono text-xs border-t border-primary/20 pt-2 mt-2">
                                                        Broadcast
                                                    </p>
                                                </div>
                                            </div>
                                        </CometCard>
                                    </div>

                                    <div ref={(el) => cardsRef.current.push(el)}>
                                        <CometCard>
                                            <div className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-6 w-48 h-40 flex flex-col justify-between hover:border-primary/30 transition-colors">
                                                <div className="flex flex-col h-full justify-between">
                                                    <div>
                                                        <h3 className="text-foreground font-mono text-sm font-bold break-all line-clamp-3">
                                                            {resultados.hosts_net}
                                                        </h3>
                                                        <h2 className="text-foreground font-mono text-sm break-all line-clamp-3">
                                                            {resultados.clase}
                                                            <br />
                                                            {resultados.tipo}
                                                        </h2>
                                                    </div>
                                                    <p className="text-foreground/60 font-mono text-xs border-t border-primary/20 pt-2 mt-2">
                                                        Hosts/Net
                                                    </p>
                                                </div>
                                            </div>
                                        </CometCard>
                                    </div>

                                    {/* Novena Card - Toggle Binario */}
                                    <div ref={(el) => cardsRef.current.push(el)}>
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
                                                <h3 className={mostrarBinario ? 'hidden' : 'text-foreground font-semibold text-sm text-center'}>
                                                    Ver Binario
                                                </h3>
                                                <h3 className={mostrarBinario ? 'text-foreground font-semibold text-sm text-center absolute inset-0 flex items-center justify-center' : 'hidden'}
                                                    style={{ transform: 'rotateY(180deg)' }}>
                                                    Ver Decimal
                                                </h3>
                                            </div>
                                        </CometCard>
                                    </div>
                                </>
                            ) : (
                                // Mostrar placeholder cuando no hay resultados
                                <>
                                    {[...Array(9)].map((_, index) => (
                                        <div key={index} ref={(el) => cardsRef.current.push(el)}>
                                            <CometCard>
                                                <div className="backdrop-blur-md bg-background/30 border border-primary/10 rounded-xl p-6 w-48 h-40 flex flex-col justify-center items-center hover:border-primary/30 transition-colors">
                                                    <p className="text-muted-foreground/50 text-sm text-center italic">
                                                        Ingresa una IP y máscara
                                                    </p>
                                                </div>
                                            </CometCard>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
