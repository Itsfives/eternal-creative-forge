import { useEffect, useRef } from 'react';

interface LogoParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  targetScale: number;
}

const LogoParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<LogoParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const logoImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load logo image
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/lovable-uploads/2fa6123b-b4cf-4f40-ab0b-a089850b5ad8.png';
    logoImg.onload = () => {
      logoImageRef.current = logoImg;
      createParticles();
      animate();
    };
    logoImg.onerror = () => {
      console.log('Logo image failed to load');
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (logoImageRef.current) {
        createParticles();
      }
    };

    const createParticles = () => {
      const particles: LogoParticle[] = [];
      const numParticles = Math.min(15, Math.floor(window.innerWidth / 80)); // Responsive particle count
      
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 30 + 20, // Logo size range
          opacity: Math.random() * 0.4 + 0.1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          scale: 1,
          targetScale: 1
        });
      }
      particlesRef.current = particles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!logoImageRef.current) {
        requestAnimationFrame(animate);
        return;
      }

      particlesRef.current.forEach((particle, index) => {
        // Mouse interaction - attraction and repulsion
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          const attraction = distance < 50 ? -1 : 1; // Repel when very close, attract when farther
          
          particle.vx += (dx / distance) * force * 0.003 * attraction;
          particle.vy += (dy / distance) * force * 0.003 * attraction;
          particle.targetScale = 1 + force * 0.5; // Scale up on interaction
        } else {
          particle.targetScale = 1;
        }

        // Smooth scale transition
        particle.scale += (particle.targetScale - particle.scale) * 0.1;

        // Update position with gentle drift
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Rotation
        particle.rotation += particle.rotationSpeed;

        // Boundary wrapping (seamless loop)
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;

        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Draw clean logo with proper transparency
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.scale(particle.scale, particle.scale);
        
        // Set transparency and draw the logo cleanly
        ctx.globalAlpha = particle.opacity;
        ctx.globalCompositeOperation = 'source-over';
        
        // Draw the logo at proper size
        const logoSize = particle.size * 1.5;
        ctx.drawImage(
          logoImageRef.current,
          -logoSize / 2,
          -logoSize / 2,
          logoSize,
          logoSize
        );
        
        ctx.restore();

        // Draw connections between nearby logos
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const alpha = (1 - distance / 200) * 0.15;
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y,
              otherParticle.x, otherParticle.y
            );
            gradient.addColorStop(0, `hsla(154, 70%, 45%, ${alpha})`);
            gradient.addColorStop(0.5, `hsla(200, 70%, 50%, ${alpha * 0.8})`);
            gradient.addColorStop(1, `hsla(271, 76%, 53%, ${alpha * 0.6})`);
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      resizeCanvas();
    };

    resizeCanvas();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default LogoParticles;