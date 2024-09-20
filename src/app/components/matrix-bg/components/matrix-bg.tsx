"use client"

import React, { useRef, useEffect } from "react";

interface MatrixRainProps {
  intensity?: number;
  speed?: number;
  width?: number;
  height?: number;
}

const MatrixRain: React.FC<MatrixRainProps> = ({
  intensity = 5,
  speed = 50,
  height,
  width,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width ? width : window.innerWidth;
    canvas.height = height ? height : window.innerHeight;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+{}[]|;:,.<>?";
    const drops = new Array(columns).fill(0);

    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = "#0F0";

      for (let i = 0; i < drops.length; i++) {
        if (drops[i] > 0 || Math.random() < 0.01) {
          const text =
            characters[Math.floor(Math.random() * characters.length)];

          // Add glow effect to characters
          ctx.shadowColor = "#0F0";
          ctx.shadowBlur = 10;
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          // Reset shadow for next iteration
          ctx.shadowBlur = 0;

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          } else {
            drops[i]++;
          }
        }
      }
    }

    const intervalId = setInterval(draw, speed);

    return () => clearInterval(intervalId);
  }, [intensity, speed]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-[-1] opacity-25" />;
};

export default MatrixRain;
