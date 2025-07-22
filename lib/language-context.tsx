'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { Language, coreTranslations, loadFullTranslations } from './translations-optimized';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any; // Will be dynamically loaded
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [fullTranslations, setFullTranslations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use core translations immediately for fast initial load
  const translations = useMemo(() => {
    if (fullTranslations) {
      return fullTranslations;
    }
    return coreTranslations[language];
  }, [language, fullTranslations]);

  // Load full translations lazily after initial render
  useEffect(() => {
    const loadTranslations = async () => {
      // Only load full translations if user changes language or after initial load
      if (fullTranslations === null) {
        setIsLoading(true);
        try {
          const full = await loadFullTranslations(language);
          setFullTranslations(full);
        } catch (error) {
          console.error('Failed to load translations:', error);
          // Keep using core translations
        } finally {
          setIsLoading(false);
        }
      }
    };

    // Delay loading to prioritize critical content
    const timer = setTimeout(loadTranslations, 1000);
    return () => clearTimeout(timer);
  }, [language, fullTranslations]);

  const value = {
    language,
    setLanguage,
    t: translations,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 