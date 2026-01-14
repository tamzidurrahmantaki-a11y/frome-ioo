"use client"

import React, { useEffect, useState } from "react"

export function FloatingParticles() {
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([])

    useEffect(() => {
        // Generate a fixed set of random particles on mount
        const newParticles = Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            duration: Math.random() * 20 + 20,
            delay: Math.random() * -20,
        }))
        setParticles(newParticles)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute bg-[#00C975] rounded-full blur-[1px]"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animation: `float-fade ${p.duration}s linear infinite`,
                        animationDelay: `${p.delay}s`,
                        boxShadow: `0 0 10px #00C975`,
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes float-fade {
                    0% {
                        transform: translate(0, 0);
                        opacity: 0;
                    }
                    20% {
                        opacity: 0.6;
                    }
                    50% {
                        transform: translate(100px, -50px);
                        opacity: 0.8;
                    }
                    80% {
                        opacity: 0.6;
                    }
                    100% {
                        transform: translate(200px, -100px);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    )
}
