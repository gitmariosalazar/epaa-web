import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * Clean Architecture / SOLID (SRP & OCP):
 * Generic, type-safe lazy loader for named React component exports.
 * Includes single-attempt automatic recovery if a production deployment
 * invalidates an older chunk hash while the user has a tab open.
 */
export function lazyNamed<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
  K extends keyof T
>(
  factory: () => Promise<T>,
  name: K
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): LazyExoticComponent<T[K] extends ComponentType<any> ? T[K] : never> {
  return lazy(async () => {
    const storageKey = `agy_chunk_retry_${String(name)}`;
    try {
      const module = await factory();
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(storageKey);
      }
      return { default: module[name] };
    } catch (error) {
      if (
        typeof window !== 'undefined' &&
        !sessionStorage.getItem(storageKey)
      ) {
        sessionStorage.setItem(storageKey, '1');
        window.location.reload();
      }
      throw error;
    }
  });
}
