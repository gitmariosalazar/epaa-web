import React, { useEffect, useRef } from 'react';
import '../styles/Seasonal.css';

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  opacity: number;
  swingAngle: number;
  swingSpeed: number;
  rotation: number; // rotación individual
  rotationSpeed: number; // velocidad de giro
}

export interface SnowCanvasProps {
  flakeCount?: number;
}

export const SnowCanvas: React.FC<SnowCanvasProps> = ({ flakeCount = 55 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupCanvasSize = () => {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setupCanvasSize();

    // Inicializar copos de nieve
    const flakes: Snowflake[] = Array.from({ length: flakeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.8 + 1.4, // 1.4px a 4.2px
      speedY: Math.random() * 1.4 + 0.55,
      speedX: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.4 + 0.35,
      swingAngle: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.018 + 0.008,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015 // giro suave
    }));

    // Función para dibujar un copo de nieve real
    const drawSnowflake = (
      x: number,
      y: number,
      size: number,
      rotation: number,
      opacity: number,
      rgb: string,
      shadowColor: string,
      isDark: boolean
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      ctx.strokeStyle = `rgba(${rgb}, ${opacity.toFixed(2)})`;
      ctx.fillStyle = `rgba(${rgb}, ${(opacity * 0.9).toFixed(2)})`;
      ctx.lineWidth = Math.max(0.7, size * 0.28);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Sombra suave
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = isDark ? (size > 2.8 ? 5 : 2.5) : 1.2;

      const arms = 6;
      const armLength = size;

      for (let i = 0; i < arms; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * i) / arms);

        // Brazo principal
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -armLength);
        ctx.stroke();

        // Ramas laterales (solo en copos medianos/grandes)
        if (size > 2.2) {
          const branchStart = armLength * 0.45;
          const branchLength = armLength * 0.38;

          // Rama izquierda
          ctx.beginPath();
          ctx.moveTo(0, -branchStart);
          ctx.lineTo(-branchLength * 0.55, -branchStart - branchLength * 0.35);
          ctx.stroke();

          // Rama derecha
          ctx.beginPath();
          ctx.moveTo(0, -branchStart);
          ctx.lineTo(branchLength * 0.55, -branchStart - branchLength * 0.35);
          ctx.stroke();
        }

        // Pequeña punta o cristal en el extremo (opcional, se ve muy bien)
        if (size > 2.6) {
          ctx.beginPath();
          ctx.arc(0, -armLength, size * 0.18, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // Centro del copo
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Bucle de renderizado
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const rgb = isDark ? '255, 255, 255' : '100, 116, 139'; // slate-500
      const shadowColor = isDark
        ? 'rgba(255, 255, 255, 0.65)'
        : 'rgba(71, 85, 105, 0.22)';

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];

        // Movimiento + viento
        f.swingAngle += f.swingSpeed;
        const wind = Math.sin(f.swingAngle) * 0.55;

        f.y += f.speedY;
        f.x += f.speedX + wind;
        f.rotation += f.rotationSpeed;

        // Reciclar copo
        if (f.y > height + 8) {
          f.y = -8;
          f.x = Math.random() * width;
        }
        if (f.x > width + 8) f.x = -8;
        else if (f.x < -8) f.x = width + 8;

        const currentOpacity = isDark
          ? f.opacity
          : Math.min(1, f.opacity + 0.32);

        // Dibujar el copo real
        drawSnowflake(
          f.x,
          f.y,
          f.radius,
          f.rotation,
          currentOpacity,
          rgb,
          shadowColor,
          isDark
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => setupCanvasSize();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [flakeCount]);

  return (
    <canvas
      ref={canvasRef}
      className="seasonal-snow-canvas"
      aria-hidden="true"
    />
  );
};
