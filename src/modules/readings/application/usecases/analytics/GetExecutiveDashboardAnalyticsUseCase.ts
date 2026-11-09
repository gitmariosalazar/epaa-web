import type {
  AnalyticsFilterParams,
  AnalyticsSystemType,
  ExecutiveDashboardAnalytics,
} from '../../../domain/models/readings-analytics';
import type { ReadingsAnalyticsRepository } from '../../../domain/repositories/ReadingsAnalyticsRepository';

export class GetExecutiveDashboardAnalyticsUseCase {
  private readonly repository: ReadingsAnalyticsRepository;

  constructor(repository: ReadingsAnalyticsRepository) {
    this.repository = repository;
  }

  async execute(
    filter: AnalyticsFilterParams,
    system: AnalyticsSystemType,
  ): Promise<ExecutiveDashboardAnalytics> {
    return this.repository.getExecutiveDashboard(filter, system);
  }
}
