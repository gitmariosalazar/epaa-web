import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
  SectorPerformanceAnalytics,
} from '../../../domain/models/readings-analytics';
import type { ReadingsAnalyticsRepository } from '../../../domain/repositories/ReadingsAnalyticsRepository';

export class GetSectorPerformanceAnalyticsUseCase {
  private readonly repository: ReadingsAnalyticsRepository;

  constructor(repository: ReadingsAnalyticsRepository) {
    this.repository = repository;
  }

  async execute(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<SectorPerformanceAnalytics[]> {
    return this.repository.getSectorPerformance(filter, system);
  }
}
