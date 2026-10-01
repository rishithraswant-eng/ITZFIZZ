'use client';

import { useEffect, useRef } from 'react';

const PARTICLES = 80;
type Particle = { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string };

export default function TransformCanvas({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstFired = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Trigger burst around 65% scroll
    if (progress > 0.65 && !burstFired.current) {
      burstFired.current = true;
      spawnBurst(canvas);
    } else if (progress < 0.60) {
      // Reset so it can fire again if we scroll back up
      burstFired.current = false;
    }
  }, [progress]);

  function spawnBurst(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLES; i++) {
      const angle = (Math.PI * 2 * i) / PARTICLES + Math.random() * 0.3;
      const speed = 3 + Math.random() * 8;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: 2 + Math.random() * 4,
        color: Math.random() > 0.5 ? 'var(--color-gold-light, #F0C96A)' : '#FFFFFF',
      });
    }

    function tick() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.life -= 0.018;
        if (p.life < 0) p.life = 0;
        
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (particles.some((p) => p.life > 0)) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    tick();
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-30 w-full h-full"
    />
  );
}
