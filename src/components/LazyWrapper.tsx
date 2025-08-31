import { Suspense, lazy, ComponentType } from 'react';

interface LazyWrapperProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

// Generic lazy loading wrapper with error boundary
const LazyWrapper = ({ 
  fallback = (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="loading-dots">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  ), 
  children 
}: LazyWrapperProps) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// Helper function to create lazy components with error boundaries
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFn);
  
  return (props: React.ComponentProps<T>) => (
    <LazyWrapper fallback={fallback}>
      <LazyComponent {...props} />
    </LazyWrapper>
  );
};

// Pre-configured lazy components for common use cases
export const LazyInteractiveParticles = createLazyComponent(
  () => import('./PerformantInteractiveParticles'),
  <div className="fixed inset-0 pointer-events-none z-0" />
);

export const LazyLogoParticles = createLazyComponent(
  () => import('./PerformantLogoParticles'),
  <div className="fixed inset-0 pointer-events-none z-0" />
);

export const LazyAdminStats = createLazyComponent(
  () => import('./AdminStats')
);

export const LazyPortfolioEditor = createLazyComponent(
  () => import('./PortfolioEditor')
);

export const LazyRichTextEditor = createLazyComponent(
  () => import('./RichTextEditor')
);

export const LazyPageEditor = createLazyComponent(
  () => import('./PageEditor')
);

export const LazyCmsPageBuilder = createLazyComponent(
  () => import('./CmsPageBuilder')
);

export default LazyWrapper;