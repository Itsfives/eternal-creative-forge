import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const PerformantInteractiveParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationIdRef = useRef<number>();
  const isVisibleRef = useRef(true);
  const lastFrameTimeRef = useRef(0);
  const targetFPS = 60;
  const frameInterval = 1000 / targetFPS;

  // Responsive particle count based on device capabilities
  const getParticleCount = useCallback(() => {
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    
    if (isMobile || isLowEnd) return 25;
    if (width < 1200) return 35;
    return 50;
  }, []);

  // Throttled mouse move handler
  const throttledMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Debounced resize handler
  const debouncedResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
  }, []);

  const createParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles: Particle[] = [];
    const colors = ['hsl(154, 70%, 45%)', 'hsl(271, 76%, 53%)'];
    const particleCount = getParticleCount();
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, // Reduced velocity for better performance
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1, // Smaller particles
        opacity: Math.random() * 0.4 + 0.1, // Reduced opacity range
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    particlesRef.current = particles;
  }, [getParticleCount]);

  const animate = useCallback((currentTime: number) => {
    if (!isVisibleRef.current) {
      animationIdRef.current = requestAnimationFrame(animate);
      return;
    }

    // Frame rate limiting
    if (currentTime - lastFrameTimeRef.current < frameInterval) {
      animationIdRef.current = requestAnimationFrame(animate);
      return;
    }
    lastFrameTimeRef.current = currentTime;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const particles = particlesRef.current;
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;

    // Process particles in batches for better performance
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      
      // Mouse interaction (simplified)
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distanceSquared = dx * dx + dy * dy; // Avoid sqrt for performance
      
      if (distanceSquared < 10000) { // 100px radius squared
        const distance = Math.sqrt(distanceSquared);
        const force = (100 - distance) / 10000; // Simplified force calculation
        particle.vx -= (dx / distance) * force;
        particle.vy -= (dy / distance) * force;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary wrapping (more efficient than reflection)
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Apply friction
      particle.vx *= 0.995;
      particle.vy *= 0.995;

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('hsl', 'hsla');
      ctx.fill();

      // Draw connections only to nearby particles (optimized)
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const odx = particle.x - other.x;
        const ody = particle.y - other.y;
        const odistanceSquared = odx * odx + ody * ody;

        if (odistanceSquared < 8100) { // 90px radius squared (reduced from 100px)
          const odistance = Math.sqrt(odistanceSquared);
          const alpha = 0.05 * (1 - odistance / 90); // Reduced connection opacity
          
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `hsla(154, 70%, 45%, ${alpha})`;
          ctx.lineWidth = 0.5; // Thinner lines
          ctx.stroke();
        }
      }
    }

    animationIdRef.current = requestAnimationFrame(animate);
  }, [frameInterval]);

  // Intersection Observer for visibility-based performance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initial setup
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
    
    // Start animation
    animationIdRef.current = requestAnimationFrame(animate);

    // Event listeners with passive option for better performance
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(debouncedResize, 150);
    };

    let mouseTimeout: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => throttledMouseMove(e), 16); // ~60fps throttling
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      clearTimeout(resizeTimeout);
      clearTimeout(mouseTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [animate, createParticles, debouncedResize, throttledMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default PerformantInteractiveParticles;