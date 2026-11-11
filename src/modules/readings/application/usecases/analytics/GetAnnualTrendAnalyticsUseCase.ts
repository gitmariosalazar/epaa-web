import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
  AnnualTrendAnalytics,
} from '../../../domain/models/readings-analytics';
import type { ReadingsAnalyticsRepository } from '../../../domain/repositories/ReadingsAnalyticsRepository';

export class GetAnnualTrendAnalyticsUseCase {
  private readonly repository: ReadingsAnalyticsRepository;

  constructor(repository: ReadingsAnalyticsRepository) {
    this.repository = repository;
  }

  async execute(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<AnnualTrendAnalytics[]> {
    return this.repository.getAnnualTrend(filter, system);
  }
}
