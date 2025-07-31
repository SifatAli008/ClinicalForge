import { cn, safeTranslate, getPlaceholder } from '@/lib/utils';

describe('Utils Functions', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('bg-red-500', 'text-white', 'p-4');
      expect(result).toBe('bg-red-500 text-white p-4');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toBe('base-class active-class');
    });

    it('should handle falsy values', () => {
      const isActive = false;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toBe('base-class');
    });
  });

  describe('safeTranslate function', () => {
    const testObj = {
      nested: {
        key: 'value',
        deep: {
          value: 'deep-value'
        }
      }
    };

    it('should return nested value when path exists', () => {
      const result = safeTranslate(testObj, 'nested.key', 'fallback');
      expect(result).toBe('value');
    });

    it('should return fallback when path does not exist', () => {
      const result = safeTranslate(testObj, 'nested.missing', 'fallback');
      expect(result).toBe('fallback');
    });

    it('should return fallback for deep nested paths', () => {
      const result = safeTranslate(testObj, 'nested.deep.value', 'fallback');
      expect(result).toBe('deep-value');
    });

    it('should handle empty object', () => {
      const result = safeTranslate({}, 'any.path', 'fallback');
      expect(result).toBe('fallback');
    });
  });

  describe('getPlaceholder function', () => {
    const translations = {
      placeholders: {
        name: 'Enter your name',
        email: 'Enter your email'
      }
    };

    it('should return placeholder from translations', () => {
      const result = getPlaceholder(translations, 'name', 'Default name');
      expect(result).toBe('Enter your name');
    });

    it('should return fallback when placeholder not found', () => {
      const result = getPlaceholder(translations, 'missing', 'Default fallback');
      expect(result).toBe('Default fallback');
    });
  });
}); 