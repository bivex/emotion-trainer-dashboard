/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-28T23:03:44
 * Last Updated: 2025-12-28T23:03:44
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import React, { useEffect, useRef } from 'react';
import { useTheme } from './theme-provider';

interface MatrixBackgroundProps {
  children: React.ReactNode;
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const isDark = resolvedTheme === 'dark';
    const palette = isDark
      ? {
          backgroundStart: 'hsl(236, 24%, 8%)',
          backgroundMid: 'hsl(240, 20%, 10%)',
          backgroundEnd: 'hsl(244, 24%, 7%)',
          gridColor: 'rgba(139, 92, 246, 0.055)',
          streamRgb: '129, 140, 248',
          particleColors: [
            'hsl(280, 100%, 72%)',
            'hsl(190, 95%, 68%)',
            'hsl(45, 100%, 64%)',
            'hsl(0, 90%, 66%)',
            'hsl(320, 85%, 68%)',
            'hsl(220, 88%, 62%)',
          ],
          particleOpacity: { min: 0.12, max: 0.55 },
        }
      : {
          backgroundStart: 'hsl(214, 55%, 98%)',
          backgroundMid: 'hsl(210, 45%, 96%)',
          backgroundEnd: 'hsl(195, 45%, 97%)',
          gridColor: 'rgba(79, 70, 229, 0.06)',
          streamRgb: '56, 189, 248',
          particleColors: [
            'hsl(268, 82%, 66%)',
            'hsl(193, 88%, 58%)',
            'hsl(42, 96%, 56%)',
            'hsl(350, 84%, 64%)',
            'hsl(172, 68%, 46%)',
            'hsl(221, 88%, 60%)',
          ],
          particleOpacity: { min: 0.05, max: 0.22 },
        };

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      canvas: HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;

      constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * (palette.particleOpacity.max - palette.particleOpacity.min) + palette.particleOpacity.min;
        this.color = palette.particleColors[Math.floor(Math.random() * palette.particleColors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;

        // Subtle pulsing
        this.opacity += (Math.random() - 0.5) * 0.01;
        this.opacity = Math.max(palette.particleOpacity.min, Math.min(palette.particleOpacity.max, this.opacity));
      }

      draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas, ctx));
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient mesh background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, palette.backgroundStart);
      gradient.addColorStop(0.5, palette.backgroundMid);
      gradient.addColorStop(1, palette.backgroundEnd);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw geometric grid overlay
      ctx.strokeStyle = palette.gridColor;
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw floating data streams
      const time = Date.now() * 0.001;
      for (let i = 0; i < 5; i++) {
        const y = (canvas.height / 6) * (i + 1) + Math.sin(time + i) * 20;
        const opacity = (isDark ? 0.09 : 0.06) + Math.sin(time * 0.5 + i) * (isDark ? 0.03 : 0.02);

        ctx.strokeStyle = `rgba(${palette.streamRgb}, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < canvas.width; x += 10) {
          const wave = Math.sin((x * 0.01) + time + i) * 5;
          if (x === 0) {
            ctx.moveTo(x, y + wave);
          } else {
            ctx.lineTo(x, y + wave);
          }
        }
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [resolvedTheme]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: -1 }}
      />

      {/* Gradient overlay for depth */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
          resolvedTheme === 'dark'
            ? 'bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.22))]'
            : 'bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.28))]'
        }`}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MatrixBackground;
