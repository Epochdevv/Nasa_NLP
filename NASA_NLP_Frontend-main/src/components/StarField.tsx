import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
}

export const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars: Star[] = Array.from({ length: 800 }, () => ({
      x: Math.random() * canvas.width - canvas.width / 2,
      y: Math.random() * canvas.height - canvas.height / 2,
      z: Math.random() * canvas.width,
      size: Math.random() * 1.5,
    }));

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'hsl(220, 25%, 8%)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      stars.forEach((star) => {
        star.z -= 2;
        if (star.z <= 0) {
          star.z = canvas.width;
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
        }

        const x = (star.x / star.z) * canvas.width + centerX;
        const y = (star.y / star.z) * canvas.height + centerY;
        const size = (1 - star.z / canvas.width) * star.size * 2;

        const brightness = 1 - star.z / canvas.width;
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.8})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Add occasional colored stars (cyan/blue tint)
        if (Math.random() > 0.98) {
          ctx.fillStyle = `rgba(0, 212, 255, ${brightness * 0.5})`;
          ctx.beginPath();
          ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: 'hsl(220, 25%, 8%)' }}
    />
  );
};
