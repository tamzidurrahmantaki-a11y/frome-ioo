"use client"

import React, { useEffect, useRef } from "react"

export function DataPacketsBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []
        const particleCount = 60
        const connectionDistance = 120
        const brandGreen = "#00C975"

        class Particle {
            x: number
            y: number
            baseY: number
            size: number
            speedX: number
            opacity: number
            angle: number

            constructor() {
                this.x = Math.random() * (canvas?.width ?? 0)
                this.y = Math.random() * (canvas?.height ?? 0)
                this.baseY = this.y
                this.size = Math.random() * 1.2 + 0.5
                this.speedX = (Math.random() * 0.5) + 0.2 // Stream direction
                this.opacity = Math.random() * 0.6 + 0.3
                this.angle = Math.random() * Math.PI * 2
            }

            update() {
                this.x += this.speedX
                this.angle += 0.02
                // Wave motion
                this.y = this.baseY + Math.sin(this.angle) * 20

                if (canvas) {
                    if (this.x > canvas.width) {
                        this.x = -10
                        this.baseY = Math.random() * canvas.height
                    }
                }
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = brandGreen
                ctx.globalAlpha = this.opacity
                ctx.fill()

                // Glow effect
                ctx.shadowBlur = 8
                ctx.shadowColor = brandGreen
                ctx.globalAlpha = 1.0
            }
        }

        const resize = () => {
            if (!canvas) return
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            init()
        }

        const init = () => {
            particles = []
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle())
            }
        }

        const drawLines = () => {
            if (!ctx) return
            ctx.shadowBlur = 0
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < connectionDistance) {
                        const opacity = (1 - distance / connectionDistance) * 0.2
                        ctx.beginPath()
                        ctx.strokeStyle = brandGreen
                        ctx.globalAlpha = opacity
                        ctx.lineWidth = 0.5
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                    }
                }
            }
            ctx.globalAlpha = 1.0
        }

        const animate = () => {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            drawLines()

            particles.forEach((p) => {
                p.update()
                p.draw()
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        window.addEventListener("resize", resize)
        resize()
        animate()

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.20 }}
        />
    )
}
