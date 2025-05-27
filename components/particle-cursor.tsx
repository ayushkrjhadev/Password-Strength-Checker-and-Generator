"use client"

import { useEffect } from "react"

export function ParticleCursor() {
  useEffect(() => {
    const createParticle = (x: number, y: number) => {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.left = x + "px"
      particle.style.top = y + "px"
      document.body.appendChild(particle)

      setTimeout(() => {
        particle.remove()
      }, 2000)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.9) {
        createParticle(e.clientX, e.clientY)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return null
}
