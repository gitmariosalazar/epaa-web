import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
  ExecutiveDashboardAnalytics,
  InterannualComparisonAnalytics,
  MonthlyTrendAnalytics,
  NoveltyEconomicImpactAnalytics,
  SectorPerformanceAnalytics,
  TopConsumerAnalytics,
} from '../models/readings-analytics';

export interface ReadingsAnalyticsRepository {
  getExecutiveDashboard(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<ExecutiveDashboardAnalytics>;

  getSectorPerformance(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<SectorPerformanceAnalytics[]>;

  getMonthlyTrend(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<MonthlyTrendAnalytics[]>;

  getNoveltyEconomicImpact(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<NoveltyEconomicImpactAnalytics[]>;

  getTopConsumers(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<TopConsumerAnalytics[]>;

  getInterannualComparison(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<InterannualComparisonAnalytics[]>;
}
