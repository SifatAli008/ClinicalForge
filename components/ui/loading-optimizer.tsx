'use client';

import { useEffect, useState } from 'react';

interface LoadingOptimizerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

export function LoadingOptimizer({ 
  children, 
  fallback = <div className="animate-pulse bg-gray-200 h-4 w-full rounded" />,
  delay = 100 
}: LoadingOptimizerProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldRender) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Preload critical resources
export function ResourcePreloader() {
  useEffect(() => {
    // Preload critical fonts
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    // Preload critical images
    const preloadImages = [
      '/favicon.svg',
      '/default-avatar.svg'
    ];

    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return null;
}

// Intersection Observer for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
} 