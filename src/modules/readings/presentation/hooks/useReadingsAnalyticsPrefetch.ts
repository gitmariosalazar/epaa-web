import { useEffect, useRef } from 'react';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { cachedReadingsAnalyticsRepository } from '../../infrastructure/repositories/CachedReadingsAnalyticsRepository';
import { PrefetchReadingsAnalyticsUseCase } from '../../application/usecases/analytics/PrefetchReadingsAnalyticsUseCase';
import { readingsAnalyticsCacheService } from '../../infrastructure/cache/ReadingsAnalyticsCacheService';

/**
 * useReadingsAnalyticsPrefetch
 * Background pre-fetch hook executed on session start / login.
 * Pre-warms the analytics cache so when the user enters the Analytics module or switches tabs,
 * data displays instantaneously with zero delay.
 */
export const useReadingsAnalyticsPrefetch = () => {
  const { token, user } = useAuth();
  const hasTriggeredRef = useRef<boolean>(false);

  useEffect(() => {
    // Only run if user is authenticated and hasn't already triggered in this session
    if (!token || !user) {
      hasTriggeredRef.current = false;
      return;
    }

    if (hasTriggeredRef.current || readingsAnalyticsCacheService.isWarmedUp()) {
      return;
    }

    hasTriggeredRef.current = true;

    // Use a slight deferral (1 second) so initial page render is not blocked
    const timer = setTimeout(() => {
      const prefetchUseCase = new PrefetchReadingsAnalyticsUseCase(
        cachedReadingsAnalyticsRepository,
      );

      prefetchUseCase.execute({ system: 'legacy' }).catch((err) => {
        console.warn('[AnalyticsPrefetch] Non-critical prefetch error:', err);
      });
    }, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, [token, user]);
};
