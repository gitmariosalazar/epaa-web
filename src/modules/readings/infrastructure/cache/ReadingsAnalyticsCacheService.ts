import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
} from '../../domain/models/readings-analytics';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export interface IReadingsAnalyticsCacheService {
  get<T>(key: string): T | null;
  set<T>(key: string, data: T, ttlMs?: number): void;
  has(key: string): boolean;
  delete(key: string): void;
  clear(): void;
  isWarmedUp(): boolean;
  setWarmedUp(val: boolean): void;
  generateKey(
    endpoint: string,
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): string;
}

const DEFAULT_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const SESSION_STORAGE_KEY_PREFIX = 'epaa_readings_analytics_cache:';

export class ReadingsAnalyticsCacheService
  implements IReadingsAnalyticsCacheService
{
  private readonly memoryCache = new Map<string, CacheEntry<unknown>>();
  private _isWarmedUp = false;

  get<T>(key: string): T | null {
    // 1. Check in-memory map
    const entry = this.memoryCache.get(key);
    if (entry) {
      if (Date.now() - entry.timestamp > DEFAULT_TTL_MS) {
        this.memoryCache.delete(key);
      } else {
        return entry.data as T;
      }
    }

    // 2. Fallback to sessionStorage
    try {
      const stored = sessionStorage.getItem(`${SESSION_STORAGE_KEY_PREFIX}${key}`);
      if (stored) {
        const parsed: CacheEntry<T> = JSON.parse(stored);
        if (Date.now() - parsed.timestamp <= DEFAULT_TTL_MS) {
          // Re-populate memory cache
          this.memoryCache.set(key, parsed);
          return parsed.data;
        } else {
          sessionStorage.removeItem(`${SESSION_STORAGE_KEY_PREFIX}${key}`);
        }
      }
    } catch {
      // Ignore storage access errors
    }

    return null;
  }

  set<T>(key: string, data: T): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };

    // Save in-memory
    this.memoryCache.set(key, entry);

    // Save in sessionStorage if possible (safe try-catch)
    try {
      sessionStorage.setItem(
        `${SESSION_STORAGE_KEY_PREFIX}${key}`,
        JSON.stringify(entry),
      );
    } catch (e) {
      // QuotaExceededError or disabled storage — memoryCache is still intact
      console.warn('[ReadingsAnalyticsCache] SessionStorage quota exceeded or disabled:', e);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.memoryCache.delete(key);
    try {
      sessionStorage.removeItem(`${SESSION_STORAGE_KEY_PREFIX}${key}`);
    } catch {
      // Ignore
    }
  }

  clear(): void {
    this.memoryCache.clear();
    this._isWarmedUp = false;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith(SESSION_STORAGE_KEY_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => sessionStorage.removeItem(k));
    } catch {
      // Ignore
    }
    console.info('[ReadingsAnalyticsCache] Cache cleared successfully ✓');
  }

  isWarmedUp(): boolean {
    return this._isWarmedUp;
  }

  setWarmedUp(val: boolean): void {
    this._isWarmedUp = val;
  }

  generateKey(
    endpoint: string,
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): string {
    const { forceRefresh, ...rest } = filter;
    return `${system}:${endpoint}:${JSON.stringify(rest)}`;
  }
}

// Global Singleton Instance for presentation & prefetch sharing
export const readingsAnalyticsCacheService =
  new ReadingsAnalyticsCacheService();
