import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
  NoveltyEconomicImpactAnalytics,
} from '../../../domain/models/readings-analytics';
import type { ReadingsAnalyticsRepository } from '../../../domain/repositories/ReadingsAnalyticsRepository';

export class GetNoveltyEconomicImpactAnalyticsUseCase {
  private readonly repository: ReadingsAnalyticsRepository;

  constructor(repository: ReadingsAnalyticsRepository) {
    this.repository = repository;
  }

  async execute(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<NoveltyEconomicImpactAnalytics[]> {
    return this.repository.getNoveltyEconomicImpact(filter, system);
  }
}
