import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
  InterannualComparisonAnalytics,
} from '../../../domain/models/readings-analytics';
import type { ReadingsAnalyticsRepository } from '../../../domain/repositories/ReadingsAnalyticsRepository';

export class GetInterannualComparisonAnalyticsUseCase {
  private readonly repository: ReadingsAnalyticsRepository;

  constructor(repository: ReadingsAnalyticsRepository) {
    this.repository = repository;
  }

  async execute(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<InterannualComparisonAnalytics[]> {
    return this.repository.getInterannualComparison(filter, system);
  }
}
