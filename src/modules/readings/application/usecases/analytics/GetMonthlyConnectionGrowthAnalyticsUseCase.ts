import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
  MonthlyConnectionGrowthAnalytics,
} from '../../../domain/models/readings-analytics';
import type { ReadingsAnalyticsRepository } from '../../../domain/repositories/ReadingsAnalyticsRepository';

export class GetMonthlyConnectionGrowthAnalyticsUseCase {
  private readonly repository: ReadingsAnalyticsRepository;

  constructor(repository: ReadingsAnalyticsRepository) {
    this.repository = repository;
  }

  async execute(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<MonthlyConnectionGrowthAnalytics[]> {
    return this.repository.getMonthlyConnectionGrowth(filter, system);
  }
}
