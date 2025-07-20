import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Safe translation access with fallbacks
export function safeTranslate(obj: any, path: string, fallback: string = ''): string {
  try {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return fallback;
      }
    }
    
    return typeof result === 'string' ? result : fallback;
  } catch (error) {
    return fallback;
  }
}

// Helper for placeholder translations
export function getPlaceholder(translations: any, key: string, fallback: string): string {
  return safeTranslate(translations, `placeholders.${key}`, fallback);
}
