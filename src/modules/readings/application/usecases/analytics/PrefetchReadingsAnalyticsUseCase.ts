import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
} from '../../../domain/models/readings-analytics';
import type { ReadingsAnalyticsRepository } from '../../../domain/repositories/ReadingsAnalyticsRepository';
import { readingsAnalyticsCacheService } from '../../../infrastructure/cache/ReadingsAnalyticsCacheService';

export class PrefetchReadingsAnalyticsUseCase {
  private readonly repository: ReadingsAnalyticsRepository;

  constructor(repository: ReadingsAnalyticsRepository) {
    this.repository = repository;
  }

  async execute(options?: {
    system?: AnalyticsSystemType;
    defaultYear?: number;
    defaultMonth?: string;
  }): Promise<void> {
    const system = options?.system ?? 'legacy';
    const year = options?.defaultYear ?? 2026;
    const month = options?.defaultMonth ?? '10';

    if (readingsAnalyticsCacheService.isWarmedUp()) {
      console.info(
        '[AnalyticsPrefetch] Cache is already warmed up. Skipping duplicate prefetch.',
      );
      return;
    }

    console.info(
      `[AnalyticsPrefetch] Starting background pre-warming for Analytics (${system})...`,
    );

    const baseFilter: AnalyticsFilterParams = {
      year,
      month,
      baseYear: 2025,
      targetYear: 2026,
      onlyHomologous: true,
      startYear: 2022,
      endYear: 2026,
      limitYears: 5,
      limit: 50,
      minConsumptionM3: 50,
    };

    // Execute queries in background concurrently without throwing on individual errors
    const results = await Promise.allSettled([
      this.repository.getExecutiveDashboard(baseFilter, system),
      this.repository.getSectorPerformance(baseFilter, system),
      this.repository.getMonthlyTrend(baseFilter, system),
      this.repository.getAnnualTrend(baseFilter, system),
      this.repository.getMonthlyConnectionGrowth(baseFilter, system),
      this.repository.getInterannualComparison(baseFilter, system),
      this.repository.getTopConsumers(baseFilter, system),
      this.repository.getNoveltyEconomicImpact(baseFilter, system),
    ]);

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    readingsAnalyticsCacheService.setWarmedUp(true);
    console.info(
      `[AnalyticsPrefetch] Background pre-warming complete. (${succeeded} loaded, ${failed} failed) ✓`,
    );
  }
}
