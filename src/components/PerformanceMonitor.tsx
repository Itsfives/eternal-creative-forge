import { useEffect, useState } from 'react';
import { useOptimizedAnalytics } from '@/hooks/useOptimizedAnalytics';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0
  });
  const { trackPerformance } = useOptimizedAnalytics();

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let fpsInterval: number;

    // FPS monitoring
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        
        // Track low FPS issues
        if (fps < 30) {
          trackPerformance('low_fps', fps, 'performance_issues');
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      fpsInterval = requestAnimationFrame(measureFPS);
    };

    measureFPS();

    // Memory monitoring
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        setMetrics(prev => ({ ...prev, memoryUsage: usedMB }));
        
        // Track high memory usage
        if (usedMB > 100) {
          trackPerformance('high_memory', usedMB, 'performance_issues');
        }
      }
    };

    const memoryInterval = setInterval(monitorMemory, 5000);

    // Load time measurement
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      setMetrics(prev => ({ ...prev, loadTime }));
      trackPerformance('page_load_time', loadTime);
    });

    return () => {
      cancelAnimationFrame(fpsInterval);
      clearInterval(memoryInterval);
    };
  }, [trackPerformance]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 text-xs font-mono z-50">
      <div className="space-y-1">
        <div>FPS: <span className={metrics.fps < 30 ? 'text-destructive' : 'text-seagram-green'}>{metrics.fps}</span></div>
        <div>Memory: <span className={metrics.memoryUsage > 100 ? 'text-destructive' : 'text-seagram-green'}>{metrics.memoryUsage}MB</span></div>
        <div>Load: {Math.round(metrics.loadTime)}ms</div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;