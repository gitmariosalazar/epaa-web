import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
  TopConsumerAnalytics,
} from '../../../domain/models/readings-analytics';
import type { ReadingsAnalyticsRepository } from '../../../domain/repositories/ReadingsAnalyticsRepository';

export class GetTopConsumersAnalyticsUseCase {
  private readonly repository: ReadingsAnalyticsRepository;

  constructor(repository: ReadingsAnalyticsRepository) {
    this.repository = repository;
  }

  async execute(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<TopConsumerAnalytics[]> {
    return this.repository.getTopConsumers(filter, system);
  }
}
