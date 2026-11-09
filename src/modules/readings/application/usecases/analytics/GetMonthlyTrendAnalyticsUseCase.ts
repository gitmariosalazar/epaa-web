import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
  MonthlyTrendAnalytics,
} from '../../../domain/models/readings-analytics';
import type { ReadingsAnalyticsRepository } from '../../../domain/repositories/ReadingsAnalyticsRepository';

export class GetMonthlyTrendAnalyticsUseCase {
  private readonly repository: ReadingsAnalyticsRepository;

  constructor(repository: ReadingsAnalyticsRepository) {
    this.repository = repository;
  }

  async execute(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<MonthlyTrendAnalytics[]> {
    return this.repository.getMonthlyTrend(filter, system);
  }
}
