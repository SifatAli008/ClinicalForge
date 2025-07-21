'use client';

import React, { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth-context';
import { LanguageProvider } from '@/lib/language-context';
import { AdminProvider } from '@/lib/admin-context';
import { Loader2, Database } from 'lucide-react';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimer);
      
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  if (isLoading) {
    return (
      <html lang="en">
        <body className={inter.className} suppressHydrationWarning={true}>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="relative">
                <Database className="h-16 w-16 text-primary animate-pulse mx-auto" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-muted rounded animate-pulse w-48 mx-auto"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-32 mx-auto"></div>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Loading ClinicalForge...</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LanguageProvider>
              <AdminProvider>
                <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
                  <Navigation />
                  <main className={`transition-all duration-300 ${isScrolling ? 'scale-[0.995]' : 'scale-100'} flex-1`}>
                    {children}
                  </main>
                  <Footer />
                </div>
              </AdminProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 