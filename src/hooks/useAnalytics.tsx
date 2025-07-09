import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Analytics tracking interface
interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
}

// Custom analytics tracker
class AnalyticsTracker {
  private isInitialized = false;
  private queue: AnalyticsEvent[] = [];

  init() {
    if (this.isInitialized) return;
    
    // Initialize tracking
    this.isInitialized = true;
    
    // Process queued events
    this.queue.forEach(event => this.track(event));
    this.queue = [];
    
    console.log('Analytics tracker initialized');
  }

  track(event: AnalyticsEvent) {
    if (!this.isInitialized) {
      this.queue.push(event);
      return;
    }

    // Log analytics event
    console.log('Analytics Event:', {
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      ...event
    });

    // Here you would integrate with actual analytics services
    // Example integrations:
    
    // Google Analytics 4
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameter_1: event.userId
      });
    }

    // Facebook Pixel
    if (typeof (window as any).fbq !== 'undefined') {
      (window as any).fbq('track', event.action, {
        category: event.category,
        label: event.label,
        value: event.value
      });
    }

    // Custom backend analytics
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: event.action,
        category: event.category,
        label: event.label,
        value: event.value,
        userId: event.userId,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        referrer: document.referrer
      })
    }).catch(err => console.log('Analytics API not available:', err.message));
  }

  // Page view tracking
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
}

// Global analytics instance
export const analytics = new AnalyticsTracker();

// React hook for analytics
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Initialize analytics on mount
    analytics.init();
  }, []);

  useEffect(() => {
    // Track page views
    analytics.trackPageView(location.pathname);
  }, [location.pathname]);

  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackInteraction: analytics.trackInteraction.bind(analytics),
    trackBusinessEvent: analytics.trackBusinessEvent.bind(analytics),
    trackFormEvent: analytics.trackFormEvent.bind(analytics)
  };
};

// Higher-order component for automatic tracking
export const withAnalytics = (WrappedComponent: React.ComponentType<any>) => {
  return function AnalyticsComponent(props: any) {
    const analytics = useAnalytics();
    
    return <WrappedComponent {...props} analytics={analytics} />;
  };
};

export default useAnalytics;