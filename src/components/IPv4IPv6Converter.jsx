"use client"

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ArrowRightLeft, Copy, Check } from 'lucide-react'
import gsap from 'gsap'

export default function IPv4IPv6Converter({ cambiarIp }) {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [isIPv4ToIPv6, setIsIPv4ToIPv6] = useState(true)
    const [copied, setCopied] = useState(false)
    const inputRef = React.useRef(null)
    const outputRef = React.useRef(null)

    const isValidIPv4 = (ip) => {
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
        if (!ipv4Regex.test(ip)) return false

        const parts = ip.split('.')
        return parts.every(part => {
            const num = parseInt(part, 10)
            return num >= 0 && num <= 255
        })
    }

    const isValidIPv6 = (ip) => {
        const ipv6Regex = /^([\da-f]{0,4}:){2,7}[\da-f]{0,4}$/i
        return ipv6Regex.test(ip)
    }

    const convertIPv4ToIPv6 = (ipv4) => {
        //logica de python
        return 'ip'
    }

    const convertIPv6ToIPv4 = (ipv6) => {
        //logica de python
        return 'ip'
    }

    useEffect(() => {
        if (input.trim() === '') {
            setOutput('')
            return
        }

        if (isIPv4ToIPv6) {
            setOutput(convertIPv4ToIPv6(input))
        } else {
            setOutput(convertIPv6ToIPv4(input))
        }
    }, [input, isIPv4ToIPv6])

    const handleSwitchChange = (checked) => {
        setIsIPv4ToIPv6(checked)
        cambiarIp(checked)

        if (inputRef.current) {
            gsap.fromTo(
                inputRef.current,
                { opacity: 0.5, x: -20 },
                { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
            )
        }
    }

    const handleCopy = async () => {
        if (output) {
            await navigator.clipboard.writeText(output)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w">
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        {isIPv4ToIPv6 ? 'Dirección IPv4' : 'Dirección IPv6'}
                    </label>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${isIPv4ToIPv6
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-purple-500/20 text-purple-400'
                        }`}>
                        {isIPv4ToIPv6 ? 'IPv4' : 'IPv6'}
                    </span>
                </div>

                {/* Switch */}
                <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg border border-muted-foreground/20 backdrop-blur-sm">
                    <Switch
                        checked={isIPv4ToIPv6}
                        onCheckedChange={handleSwitchChange}
                        className="scale-125"
                    />
                    <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                </div>

                <div className="flex-1 text-right">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        {isIPv4ToIPv6 ? 'Dirección IPv6' : 'Dirección IPv4'}
                    </label>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${isIPv4ToIPv6
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-blue-500/20 text-blue-400'
                        }`}>
                        {isIPv4ToIPv6 ? 'IPv6' : 'IPv4'}
                    </span>
                </div>
            </div>

            {/* Entrada */}
            <Card className="backdrop-blur-lg bg-background/80 border-primary/20 hover:border-primary/40 transition-colors p-4 group">
                <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isIPv4ToIPv6 ? '192.168.1.1' : '::ffff:c0a8:0101'}
                    className="bg-transparent border-0 text-lg font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 text-foreground"
                />
            </Card>

            {/* Salida */}
            <Card className="backdrop-blur-lg bg-background/80 border-primary/20 p-4 group relative">
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <p className="text-lg font-mono text-primary/80 break-all min-h-[1.5em] flex items-center">
                            {output || (
                                <span className="text-muted-foreground/50 italic">
                                    {input ? 'Convirtiendo...' : 'Ingresa una dirección IP'}
                                </span>
                            )}
                        </p>
                    </div>

                    {output && (
                        <button
                            onClick={handleCopy}
                            className="ml-2 p-2 rounded-lg hover:bg-primary/10 transition-colors shrink-0"
                            title="Copiar"
                        >
                            {copied ? (
                                <Check className="w-5 h-5 text-green-500" />
                            ) : (
                                <Copy className="w-5 h-5 text-muted-foreground hover:text-primary" />
                            )}
                        </button>
                    )}
                </div>
            </Card>

            {input && !output && (
                <div className="text-xs text-red-500/70 text-center animate-pulse">
                    Formato de dirección IP no válido
                </div>
            )}
        </div>
    )
}
