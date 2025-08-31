import { useEffect, useRef, useCallback } from 'react';

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

const PerformantLogoParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<LogoParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const logoImageRef = useRef<HTMLImageElement | null>(null);
  const animationIdRef = useRef<number>();
  const isVisibleRef = useRef(true);
  const lastFrameTimeRef = useRef(0);
  const targetFPS = 45; // Slightly lower FPS for logo particles
  const frameInterval = 1000 / targetFPS;

  // Responsive particle count based on device capabilities
  const getParticleCount = useCallback(() => {
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    
    if (isMobile || isLowEnd) return 8;
    if (width < 1200) return 12;
    return 15;
  }, []);

  // Optimized logo loading with error handling
  const loadLogo = useCallback(() => {
    if (logoImageRef.current) return; // Already loaded

    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/lovable-uploads/2fa6123b-b4cf-4f40-ab0b-a089850b5ad8.png';
    
    logoImg.onload = () => {
      logoImageRef.current = logoImg;
      createParticles();
      if (!animationIdRef.current) {
        animationIdRef.current = requestAnimationFrame(animate);
      }
    };
    
    logoImg.onerror = () => {
      console.warn('Logo image failed to load for particle system');
    };
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
    if (logoImageRef.current) {
      createParticles();
    }
  }, []);

  const createParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles: LogoParticle[] = [];
    const particleCount = getParticleCount();
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2, // Reduced velocity
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 20 + 15, // Smaller logos
        opacity: Math.random() * 0.3 + 0.1, // Reduced opacity range
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01, // Slower rotation
        scale: 1,
        targetScale: 1
      });
    }
    particlesRef.current = particles;
  }, [getParticleCount]);

  const animate = useCallback((currentTime: number) => {
    if (!isVisibleRef.current || !logoImageRef.current) {
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

    // Process particles with optimizations
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      
      // Mouse interaction (simplified and optimized)
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distanceSquared = dx * dx + dy * dy;
      
      if (distanceSquared < 22500) { // 150px radius squared
        const distance = Math.sqrt(distanceSquared);
        const force = (150 - distance) / 150000; // Reduced force multiplier
        const attraction = distance < 50 ? -1 : 1;
        
        particle.vx += (dx / distance) * force * attraction;
        particle.vy += (dy / distance) * force * attraction;
        particle.targetScale = 1 + (force * 50); // Reduced scale effect
      } else {
        particle.targetScale = 1;
      }

      // Smooth scale transition (optimized)
      particle.scale += (particle.targetScale - particle.scale) * 0.05;

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Rotation
      particle.rotation += particle.rotationSpeed;

      // Boundary wrapping
      const margin = particle.size;
      if (particle.x < -margin) particle.x = canvas.width + margin;
      if (particle.x > canvas.width + margin) particle.x = -margin;
      if (particle.y < -margin) particle.y = canvas.height + margin;
      if (particle.y > canvas.height + margin) particle.y = -margin;

      // Apply friction
      particle.vx *= 0.996;
      particle.vy *= 0.996;

      // Draw logo with optimizations
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.scale(particle.scale, particle.scale);
      
      // Reduced opacity and effects for better performance
      ctx.globalAlpha = Math.max(0.5, particle.opacity);
      ctx.globalCompositeOperation = 'source-over';
      
      // Reduced glow effect
      ctx.shadowColor = 'rgba(56, 178, 172, 0.3)';
      ctx.shadowBlur = 8;
      
      const logoSize = particle.size * 1.1;
      ctx.drawImage(
        logoImageRef.current,
        -logoSize / 2,
        -logoSize / 2,
        logoSize,
        logoSize
      );
      
      ctx.restore();

      // Optimized connections (reduce frequency and complexity)
      if (i % 2 === 0) { // Only draw connections for every other particle
        for (let j = i + 2; j < particles.length; j += 2) {
          const other = particles[j];
          const odx = particle.x - other.x;
          const ody = particle.y - other.y;
          const odistanceSquared = odx * odx + ody * ody;

          if (odistanceSquared < 32400) { // 180px radius squared
            const odistance = Math.sqrt(odistanceSquared);
            const alpha = (1 - odistance / 180) * 0.08; // Reduced connection opacity
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(56, 178, 172, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
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
    
    // Load logo and setup
    loadLogo();

    // Event listeners with passive option and throttling
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(debouncedResize, 200);
    };

    let mouseTimeout: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => throttledMouseMove(e), 32); // ~30fps throttling for logo particles
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
  }, [animate, loadLogo, debouncedResize, throttledMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default PerformantLogoParticles;