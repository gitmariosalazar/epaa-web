import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
  AnnualTrendAnalytics,
  ExecutiveDashboardAnalytics,
  InterannualComparisonAnalytics,
  MonthlyConnectionGrowthAnalytics,
  MonthlyTrendAnalytics,
  NoveltyEconomicImpactAnalytics,
  SectorPerformanceAnalytics,
  TopConsumerAnalytics,
} from '../../domain/models/readings-analytics';
import type { ReadingsAnalyticsRepository } from '../../domain/repositories/ReadingsAnalyticsRepository';
import { ReadingsAnalyticsRepositoryImpl } from './ReadingsAnalyticsRepositoryImpl';
import {
  type IReadingsAnalyticsCacheService,
  readingsAnalyticsCacheService,
} from '../cache/ReadingsAnalyticsCacheService';

/**
 * CachedReadingsAnalyticsRepository
 * Decorator / Proxy pattern implementing Clean Architecture & SOLID (OCP, LSP, DIP, SRP).
 * Intercepts repository calls to serve cached datasets with zero latency unless forceRefresh is requested.
 */
export class CachedReadingsAnalyticsRepository
  implements ReadingsAnalyticsRepository
{
  private readonly repository: ReadingsAnalyticsRepository;
  private readonly cacheService: IReadingsAnalyticsCacheService;

  constructor(
    repository: ReadingsAnalyticsRepository = new ReadingsAnalyticsRepositoryImpl(),
    cacheService: IReadingsAnalyticsCacheService = readingsAnalyticsCacheService,
  ) {
    this.repository = repository;
    this.cacheService = cacheService;
  }

  async getExecutiveDashboard(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<ExecutiveDashboardAnalytics> {
    const key = this.cacheService.generateKey(
      'executive-dashboard',
      filter,
      system,
    );

    if (!filter.forceRefresh) {
      const cached = this.cacheService.get<ExecutiveDashboardAnalytics>(key);
      if (cached) return cached;
    }

    const data = await this.repository.getExecutiveDashboard(filter, system);
    this.cacheService.set(key, data);
    return data;
  }

  async getSectorPerformance(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<SectorPerformanceAnalytics[]> {
    const key = this.cacheService.generateKey(
      'sector-performance',
      filter,
      system,
    );

    if (!filter.forceRefresh) {
      const cached = this.cacheService.get<SectorPerformanceAnalytics[]>(key);
      if (cached) return cached;
    }

    const data = await this.repository.getSectorPerformance(filter, system);
    this.cacheService.set(key, data);
    return data;
  }

  async getMonthlyTrend(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<MonthlyTrendAnalytics[]> {
    const key = this.cacheService.generateKey('monthly-trend', filter, system);

    if (!filter.forceRefresh) {
      const cached = this.cacheService.get<MonthlyTrendAnalytics[]>(key);
      if (cached) return cached;
    }

    const data = await this.repository.getMonthlyTrend(filter, system);
    this.cacheService.set(key, data);
    return data;
  }

  async getNoveltyEconomicImpact(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<NoveltyEconomicImpactAnalytics[]> {
    const key = this.cacheService.generateKey(
      'novelty-economic-impact',
      filter,
      system,
    );

    if (!filter.forceRefresh) {
      const cached =
        this.cacheService.get<NoveltyEconomicImpactAnalytics[]>(key);
      if (cached) return cached;
    }

    const data = await this.repository.getNoveltyEconomicImpact(filter, system);
    this.cacheService.set(key, data);
    return data;
  }

  async getTopConsumers(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<TopConsumerAnalytics[]> {
    const key = this.cacheService.generateKey('top-consumers', filter, system);

    if (!filter.forceRefresh) {
      const cached = this.cacheService.get<TopConsumerAnalytics[]>(key);
      if (cached) return cached;
    }

    const data = await this.repository.getTopConsumers(filter, system);
    this.cacheService.set(key, data);
    return data;
  }

  async getInterannualComparison(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<InterannualComparisonAnalytics[]> {
    const key = this.cacheService.generateKey(
      'interannual-comparison',
      filter,
      system,
    );

    if (!filter.forceRefresh) {
      const cached =
        this.cacheService.get<InterannualComparisonAnalytics[]>(key);
      if (cached) return cached;
    }

    const data = await this.repository.getInterannualComparison(filter, system);
    this.cacheService.set(key, data);
    return data;
  }

  async getMonthlyConnectionGrowth(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<MonthlyConnectionGrowthAnalytics[]> {
    const key = this.cacheService.generateKey(
      'monthly-connection-growth',
      filter,
      system,
    );

    if (!filter.forceRefresh) {
      const cached =
        this.cacheService.get<MonthlyConnectionGrowthAnalytics[]>(key);
      if (cached) return cached;
    }

    const data = await this.repository.getMonthlyConnectionGrowth(
      filter,
      system,
    );
    this.cacheService.set(key, data);
    return data;
  }

  async getAnnualTrend(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<AnnualTrendAnalytics[]> {
    const key = this.cacheService.generateKey('annual-trend', filter, system);

    if (!filter.forceRefresh) {
      const cached = this.cacheService.get<AnnualTrendAnalytics[]>(key);
      if (cached) return cached;
    }

    const data = await this.repository.getAnnualTrend(filter, system);
    this.cacheService.set(key, data);
    return data;
  }
}

// Global Singleton Instance
export const cachedReadingsAnalyticsRepository =
  new CachedReadingsAnalyticsRepository();
