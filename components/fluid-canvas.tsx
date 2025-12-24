"use client"

import { useEffect, useRef, useCallback } from "react"

// Simplex noise implementation for fluid effect
const NOISE_SEED = 0
class SimplexNoise {
  private perm: number[] = []
  private permMod12: number[] = []

  private grad3 = [
    [1, 1, 0],
    [-1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [1, 0, 1],
    [-1, 0, 1],
    [1, 0, -1],
    [-1, 0, -1],
    [0, 1, 1],
    [0, -1, 1],
    [0, 1, -1],
    [0, -1, -1],
  ]

  constructor(seed = NOISE_SEED) {
    const p: number[] = []
    for (let i = 0; i < 256; i++) {
      p[i] = Math.floor(this.seededRandom(seed + i) * 256)
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255]
      this.permMod12[i] = this.perm[i] % 12
    }
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  private dot(g: number[], x: number, y: number): number {
    return g[0] * x + g[1] * y
  }

  noise2D(xin: number, yin: number): number {
    const F2 = 0.5 * (Math.sqrt(3) - 1)
    const G2 = (3 - Math.sqrt(3)) / 6

    let n0, n1, n2
    const s = (xin + yin) * F2
    const i = Math.floor(xin + s)
    const j = Math.floor(yin + s)
    const t = (i + j) * G2
    const X0 = i - t
    const Y0 = j - t
    const x0 = xin - X0
    const y0 = yin - Y0

    let i1, j1
    if (x0 > y0) {
      i1 = 1
      j1 = 0
    } else {
      i1 = 0
      j1 = 1
    }

    const x1 = x0 - i1 + G2
    const y1 = y0 - j1 + G2
    const x2 = x0 - 1 + 2 * G2
    const y2 = y0 - 1 + 2 * G2

    const ii = i & 255
    const jj = j & 255
    const gi0 = this.permMod12[ii + this.perm[jj]]
    const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]]
    const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]]

    let t0 = 0.5 - x0 * x0 - y0 * y0
    if (t0 < 0) n0 = 0
    else {
      t0 *= t0
      n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0)
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1
    if (t1 < 0) n1 = 0
    else {
      t1 *= t1
      n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1)
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2
    if (t2 < 0) n2 = 0
    else {
      t2 *= t2
      n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2)
    }

    return 70 * (n0 + n1 + n2)
  }
}

export function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 })
  const animationRef = useRef<number>(0)
  const noiseRef = useRef<SimplexNoise>(new SimplexNoise())

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  const handleMouseMove = useCallback((e: MouseEvent) => {
    targetMouseRef.current = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const noise = noiseRef.current

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)

    let time = 0
    const animate = () => {
      time += 0.003

      // Smooth mouse interpolation
      mouseRef.current.x = lerp(mouseRef.current.x, targetMouseRef.current.x, 0.05)
      mouseRef.current.y = lerp(mouseRef.current.y, targetMouseRef.current.y, 0.05)

      const width = canvas.width / Math.min(window.devicePixelRatio, 2)
      const height = canvas.height / Math.min(window.devicePixelRatio, 2)

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, "#0a0a0f")
      gradient.addColorStop(0.5, "#0f0f1a")
      gradient.addColorStop(1, "#0a0a0f")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Draw fluid effect with optimized resolution
      const resolution = 32 // Significantly increased for performance (was 6)
      const cols = Math.ceil(width / resolution)
      const rows = Math.ceil(height / resolution)

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * resolution
          const py = y * resolution

          // Normalize coordinates
          const nx = px / width
          const ny = py / height

          // Mouse influence
          const dx = nx - mouseRef.current.x
          const dy = ny - mouseRef.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const mouseInfluence = Math.exp(-dist * 3) * 0.3

          // Domain warping for liquid effect (Simplified)
          const warp1 = noise.noise2D(nx * 2 + time, ny * 2) * 0.5
          
          // Final noise value with mouse interaction
          const n = noise.noise2D(
            nx * 1.5 + warp1 + mouseInfluence,
            ny * 1.5 + mouseInfluence,
          )

          // Color calculation - deep blue to cyan palette
          const value = (n + 1) * 0.5
          const alpha = (0.05 + value * 0.1 + mouseInfluence * 0.2).toFixed(2) // Optimize alpha string

          ctx.fillStyle = `rgba(10, 80, 150, ${alpha})` // Simplified color
          ctx.fillRect(px, py, resolution, resolution)
        }
      }

      // Add specular highlights for depth
      const highlightGradient = ctx.createRadialGradient(
        width * mouseRef.current.x,
        height * mouseRef.current.y,
        0,
        width * mouseRef.current.x,
        height * mouseRef.current.y,
        width * 0.4,
      )
      highlightGradient.addColorStop(0, "rgba(100, 200, 255, 0.08)")
      highlightGradient.addColorStop(0.5, "rgba(50, 100, 200, 0.03)")
      highlightGradient.addColorStop(1, "transparent")
      ctx.fillStyle = highlightGradient
      ctx.fillRect(0, 0, width, height)

      // Vignette effect
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        height * 0.2,
        width / 2,
        height / 2,
        height * 0.9,
      )
      vignette.addColorStop(0, "transparent")
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.6)")
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, width, height)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationRef.current)
    }
  }, [handleMouseMove])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: "#0a0a0f" }} />
}
