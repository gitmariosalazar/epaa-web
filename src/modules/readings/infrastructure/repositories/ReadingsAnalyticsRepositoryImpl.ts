import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
  ExecutiveDashboardAnalytics,
  InterannualComparisonAnalytics,
  MonthlyTrendAnalytics,
  NoveltyEconomicImpactAnalytics,
  SectorPerformanceAnalytics,
  TopConsumerAnalytics,
} from '../../domain/models/readings-analytics';
import type { ReadingsAnalyticsRepository } from '../../domain/repositories/ReadingsAnalyticsRepository';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class ReadingsAnalyticsRepositoryImpl implements ReadingsAnalyticsRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  private resolveModernMonth(filter: AnalyticsFilterParams): string {
    if (typeof filter.month === 'string' && filter.month.includes('-')) {
      return filter.month;
    }
    const year = filter.year ?? 2026;
    const monthNum = filter.month ? Number(filter.month) : 10;
    return `${year}-${String(monthNum).padStart(2, '0')}`;
  }

  private resolveLegacyYearAndMonth(filter: AnalyticsFilterParams): { year: number; month: number | string } {
    let year = filter.year ?? 2026;
    let month: number | string = filter.month ?? 10;

    if (typeof filter.month === 'string' && filter.month.includes('-')) {
      const parts = filter.month.split('-');
      year = parseInt(parts[0], 10) || year;
      month = parseInt(parts[1], 10) || 10;
    }

    return { year, month };
  }

  private buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }

  async getExecutiveDashboard(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<ExecutiveDashboardAnalytics> {
    if (system === 'modern') {
      const query = this.buildQueryString({
        month: this.resolveModernMonth(filter),
        sector: filter.sector,
      });
      const response = await this.client.get<ApiResponse<ExecutiveDashboardAnalytics>>(
        `/Readings-Analytics/executive-dashboard${query}`,
      );
      return response.data.data;
    } else {
      const { year, month } = this.resolveLegacyYearAndMonth(filter);
      const query = this.buildQueryString({
        year,
        month,
        sector: filter.sector,
      });
      const response = await this.client.get<ApiResponse<ExecutiveDashboardAnalytics>>(
        `/Readings-Legacy-Analytics/executive-dashboard${query}`,
      );
      return response.data.data;
    }
  }

  async getSectorPerformance(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<SectorPerformanceAnalytics[]> {
    if (system === 'modern') {
      const query = this.buildQueryString({
        month: this.resolveModernMonth(filter),
        sector: filter.sector,
        sortBy: filter.sortBy,
      });
      const response = await this.client.get<ApiResponse<SectorPerformanceAnalytics[]>>(
        `/Readings-Analytics/sector-performance${query}`,
      );
      return response.data.data;
    } else {
      const { year, month } = this.resolveLegacyYearAndMonth(filter);
      const query = this.buildQueryString({
        year,
        month,
        sector: filter.sector,
        sortBy: filter.sortBy,
      });
      const response = await this.client.get<ApiResponse<SectorPerformanceAnalytics[]>>(
        `/Readings-Legacy-Analytics/sector-performance${query}`,
      );
      return response.data.data;
    }
  }

  async getMonthlyTrend(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<MonthlyTrendAnalytics[]> {
    if (system === 'modern') {
      const query = this.buildQueryString({
        year: filter.year ?? 2026,
        sector: filter.sector,
      });
      const response = await this.client.get<ApiResponse<MonthlyTrendAnalytics[]>>(
        `/Readings-Analytics/monthly-trend${query}`,
      );
      return response.data.data;
    } else {
      const { year } = this.resolveLegacyYearAndMonth(filter);
      const query = this.buildQueryString({
        year,
        sector: filter.sector,
        startMonthNumber: filter.startMonthNumber,
        endMonthNumber: filter.endMonthNumber,
      });
      const response = await this.client.get<ApiResponse<MonthlyTrendAnalytics[]>>(
        `/Readings-Legacy-Analytics/monthly-trend${query}`,
      );
      return response.data.data;
    }
  }

  async getNoveltyEconomicImpact(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<NoveltyEconomicImpactAnalytics[]> {
    if (system === 'modern') {
      const query = this.buildQueryString({
        month: this.resolveModernMonth(filter),
        sector: filter.sector,
      });
      const response = await this.client.get<ApiResponse<NoveltyEconomicImpactAnalytics[]>>(
        `/Readings-Analytics/novelty-economic-impact${query}`,
      );
      return response.data.data;
    } else {
      const { year, month } = this.resolveLegacyYearAndMonth(filter);
      const query = this.buildQueryString({
        year,
        month,
        sector: filter.sector,
      });
      const response = await this.client.get<ApiResponse<NoveltyEconomicImpactAnalytics[]>>(
        `/Readings-Legacy-Analytics/novelty-economic-impact${query}`,
      );
      return response.data.data;
    }
  }

  async getTopConsumers(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<TopConsumerAnalytics[]> {
    if (system === 'modern') {
      const query = this.buildQueryString({
        month: this.resolveModernMonth(filter),
        sector: filter.sector,
        limit: filter.limit,
        minConsumptionM3: filter.minConsumptionM3,
        novelty: filter.novelty,
      });
      const response = await this.client.get<ApiResponse<TopConsumerAnalytics[]>>(
        `/Readings-Analytics/top-consumers${query}`,
      );
      return response.data.data;
    } else {
      const { year, month } = this.resolveLegacyYearAndMonth(filter);
      const query = this.buildQueryString({
        year,
        month,
        sector: filter.sector,
        limit: filter.limit,
        minConsumptionM3: filter.minConsumptionM3,
        novelty: filter.novelty,
      });
      const response = await this.client.get<ApiResponse<TopConsumerAnalytics[]>>(
        `/Readings-Legacy-Analytics/top-consumers${query}`,
      );
      return response.data.data;
    }
  }

  async getInterannualComparison(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<InterannualComparisonAnalytics[]> {
    if (system === 'modern') {
      const query = this.buildQueryString({
        baseYear: filter.baseYear ?? 2025,
        targetYear: filter.targetYear ?? 2026,
        startMonthNumber: filter.startMonthNumber,
        endMonthNumber: filter.endMonthNumber,
        sector: filter.sector,
        onlyHomologous: filter.onlyHomologous ?? true,
      });
      const response = await this.client.get<ApiResponse<InterannualComparisonAnalytics[]>>(
        `/Readings-Analytics/interannual-comparison${query}`,
      );
      return response.data.data;
    } else {
      const { month } = this.resolveLegacyYearAndMonth(filter);
      const query = this.buildQueryString({
        baseYear: filter.baseYear ?? 2025,
        targetYear: filter.targetYear ?? 2026,
        month,
        sector: filter.sector,
        onlyHomologous: filter.onlyHomologous ?? true,
      });
      const response = await this.client.get<ApiResponse<InterannualComparisonAnalytics[]>>(
        `/Readings-Legacy-Analytics/interannual-comparison${query}`,
      );
      return response.data.data;
    }
  }
}
