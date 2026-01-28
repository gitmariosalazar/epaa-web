import type { IReportDashboardRepository } from '@/modules/dashboard/domain/repositories/report-dashboard.repository';
import type { DashboardMetrics } from '@/modules/dashboard/domain/models/report-dashboard.model';

export class GetDashboardMetricsUseCase {
  private readonly repository: IReportDashboardRepository;

  constructor(repository: IReportDashboardRepository) {
    this.repository = repository;
  }

  async execute(date: string): Promise<DashboardMetrics> {
    return this.repository.getDashboardMetrics(date);
  }
}
