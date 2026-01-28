import type { IReportDashboardRepository } from '@/modules/dashboard/domain/repositories/report-dashboard.repository';
import type { DailyStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';

export class GetDailyStatsUseCase {
  private readonly repository: IReportDashboardRepository;

  constructor(repository: IReportDashboardRepository) {
    this.repository = repository;
  }

  async execute(month: string): Promise<DailyStatsReport[]> {
    return this.repository.getDailyStatsReport(month);
  }
}
