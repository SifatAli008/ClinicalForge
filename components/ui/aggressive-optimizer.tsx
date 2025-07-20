'use client';

import { useEffect, useState } from 'react';

interface AggressiveOptimizerProps {
  children: React.ReactNode;
}

export function AggressiveOptimizer({ children }: AggressiveOptimizerProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Prioritize critical content
    const criticalContent = () => {
      // Mark critical content as ready immediately
      setIsReady(true);
    };

    // Execute critical content loading
    criticalContent();

    // Optimize non-critical resources
    const optimizeNonCritical = () => {
      // Preload images that are likely to be needed
      const imagesToPreload = [
        '/default-avatar.svg',
        '/favicon.svg'
      ];

      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
      });

      // Preload critical CSS
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = '/globals.css';
      document.head.appendChild(link);
    };

    // Delay non-critical optimizations
    const timer = setTimeout(optimizeNonCritical, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading ClinicalForge...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Critical CSS inliner for faster rendering
export function CriticalCSS() {
  useEffect(() => {
    // Inline critical CSS for above-the-fold content
    const criticalCSS = `
      .bg-background { background-color: hsl(var(--background)); }
      .text-foreground { color: hsl(var(--foreground)); }
      .min-h-screen { min-height: 100vh; }
      .flex { display: flex; }
      .items-center { align-items: center; }
      .justify-center { justify-content: center; }
      .text-center { text-align: center; }
      .animate-spin { animation: spin 1s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `;

    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}

// Resource hints for faster loading
export function ResourceHints() {
  useEffect(() => {
    // Add resource hints for faster DNS resolution
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//firebaseapp.com' },
      { rel: 'dns-prefetch', href: '//firebasestorage.app' },
      { rel: 'dns-prefetch', href: '//firebasedatabase.app' },
      { rel: 'preconnect', href: '//fonts.googleapis.com' },
      { rel: 'preconnect', href: '//fonts.gstatic.com' },
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      document.head.appendChild(link);
    });

    return () => {
      // Clean up hints on unmount
      document.querySelectorAll('link[rel="dns-prefetch"], link[rel="preconnect"]')
        .forEach(link => link.remove());
    };
  }, []);

  return null;
}

// Performance budget monitoring
export function PerformanceBudget() {
  useEffect(() => {
    const checkPerformanceBudget = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as any;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
        
        // Log performance metrics
        console.log('Performance Budget Check:', {
          loadTime: `${loadTime.toFixed(2)}ms`,
          domContentLoaded: `${domContentLoaded.toFixed(2)}ms`,
          budget: loadTime < 3000 ? '✅ Within budget' : '❌ Over budget'
        });

        // Warn if over budget
        if (loadTime > 3000) {
          console.warn('⚠️ Page load time exceeds 3-second budget');
        }
      }
    };

    // Check performance after page load
    if (document.readyState === 'complete') {
      checkPerformanceBudget();
    } else {
      window.addEventListener('load', checkPerformanceBudget);
      return () => window.removeEventListener('load', checkPerformanceBudget);
    }
  }, []);

  return null;
} 