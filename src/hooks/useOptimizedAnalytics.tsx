import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Analytics tracking interface
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
}

// Performance-optimized analytics tracker
class OptimizedAnalyticsTracker {
  private isInitialized = false;
  private queue: AnalyticsEvent[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private sessionId: string;
  private readonly BATCH_SIZE = 10;
  private readonly BATCH_TIMEOUT = 5000; // 5 seconds

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  init() {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    
    // Process queued events
    if (this.queue.length > 0) {
      this.processBatch();
    }
    
    console.log('Optimized Analytics tracker initialized');
  }

  private async sendBatch(events: AnalyticsEvent[]) {
    try {
      // Use the new Supabase Edge Function
      const response = await fetch('https://zdhwmlnvbqbeyxbdfwhx.supabase.co/functions/v1/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer
        })
      });

      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }

      console.log(`Sent batch of ${events.length} analytics events`);
    } catch (error) {
      console.warn('Analytics batch failed:', error.message);
      // Fallback: log to console for debugging
      console.log('Analytics Batch (Fallback):', events);
    }
  }

  private processBatch() {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.BATCH_SIZE);
    this.sendBatch(batch);

    // Clear timer
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    // Process remaining events if any
    if (this.queue.length > 0) {
      this.scheduleBatch();
    }
  }

  private scheduleBatch() {
    if (this.batchTimer) return;

    this.batchTimer = setTimeout(() => {
      this.processBatch();
    }, this.BATCH_TIMEOUT);
  }

  track(event: AnalyticsEvent) {
    if (!this.isInitialized) {
      this.queue.push(event);
      return;
    }

    // Add to batch queue
    this.queue.push(event);

    // Process immediately if batch is full, otherwise schedule
    if (this.queue.length >= this.BATCH_SIZE) {
      this.processBatch();
    } else {
      this.scheduleBatch();
    }
  }

  // Page view tracking with throttling
  trackPageView(path: string) {
    this.track({
      action: 'page_view',
      category: 'navigation',
      label: path
    });
  }

  // User interaction tracking
  trackInteraction(element: string, action: string) {
    this.track({
      action: 'interaction',
      category: 'user_engagement',
      label: `${element}_${action}`
    });
  }

  // Business event tracking
  trackBusinessEvent(event: string, category: string, value?: number) {
    this.track({
      action: event,
      category: category,
      value: value
    });
  }

  // Form tracking
  trackFormEvent(formName: string, action: 'start' | 'complete' | 'abandon') {
    this.track({
      action: `form_${action}`,
      category: 'forms',
      label: formName
    });
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, category = 'performance') {
    this.track({
      action: metric,
      category: category,
      value: value
    });
  }

  // Error tracking
  trackError(error: string, category = 'errors', details?: string) {
    this.track({
      action: 'error',
      category: category,
      label: error,
      value: 1
    });
  }

  // Flush remaining events (useful for page unload)
  flush() {
    if (this.queue.length > 0) {
      this.processBatch();
    }
  }
}

// Global analytics instance
export const optimizedAnalytics = new OptimizedAnalyticsTracker();

// React hook for optimized analytics
export const useOptimizedAnalytics = () => {
  const location = useLocation();
  const lastLocationRef = useRef<string>('');

  useEffect(() => {
    // Initialize analytics on mount
    optimizedAnalytics.init();

    // Flush analytics on page unload
    const handleBeforeUnload = () => {
      optimizedAnalytics.flush();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    // Track page views with throttling to prevent duplicate events
    if (location.pathname !== lastLocationRef.current) {
      lastLocationRef.current = location.pathname;
      optimizedAnalytics.trackPageView(location.pathname);
    }
  }, [location.pathname]);

  // Performance monitoring hooks
  useEffect(() => {
    // Track Core Web Vitals
    if ('web-vital' in window) {
      // @ts-ignore
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS((metric) => optimizedAnalytics.trackPerformance('CLS', metric.value));
        getFID((metric) => optimizedAnalytics.trackPerformance('FID', metric.value));
        getFCP((metric) => optimizedAnalytics.trackPerformance('FCP', metric.value));
        getLCP((metric) => optimizedAnalytics.trackPerformance('LCP', metric.value));
        getTTFB((metric) => optimizedAnalytics.trackPerformance('TTFB', metric.value));
      }).catch(() => {
        // web-vitals not available, skip
      });
    }

    // Track memory usage (if available)
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        if (memory) {
          optimizedAnalytics.trackPerformance('memory_used', memory.usedJSHeapSize);
          optimizedAnalytics.trackPerformance('memory_total', memory.totalJSHeapSize);
        }
      };

      const memoryInterval = setInterval(checkMemory, 30000); // Every 30 seconds
      return () => clearInterval(memoryInterval);
    }
  }, []);

  // Error boundary integration
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      optimizedAnalytics.trackError(event.message, 'javascript', event.filename);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      optimizedAnalytics.trackError('Unhandled Promise Rejection', 'javascript', String(event.reason));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return {
    track: useCallback((event: AnalyticsEvent) => optimizedAnalytics.track(event), []),
    trackPageView: useCallback((path: string) => optimizedAnalytics.trackPageView(path), []),
    trackInteraction: useCallback((element: string, action: string) => optimizedAnalytics.trackInteraction(element, action), []),
    trackBusinessEvent: useCallback((event: string, category: string, value?: number) => optimizedAnalytics.trackBusinessEvent(event, category, value), []),
    trackFormEvent: useCallback((formName: string, action: 'start' | 'complete' | 'abandon') => optimizedAnalytics.trackFormEvent(formName, action), []),
    trackPerformance: useCallback((metric: string, value: number, category?: string) => optimizedAnalytics.trackPerformance(metric, value, category), []),
    trackError: useCallback((error: string, category?: string, details?: string) => optimizedAnalytics.trackError(error, category, details), [])
  };
};

// Higher-order component for automatic tracking
export const withOptimizedAnalytics = (WrappedComponent: React.ComponentType<any>) => {
  return function OptimizedAnalyticsComponent(props: any) {
    const analytics = useOptimizedAnalytics();
    
    return <WrappedComponent {...props} analytics={analytics} />;
  };
};

export default useOptimizedAnalytics;