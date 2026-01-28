import type { IReportDashboardRepository } from '@/modules/dashboard/domain/repositories/report-dashboard.repository';
import type { GlobalStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';

export class GetGlobalStatsUseCase {
  private readonly repository: IReportDashboardRepository;

  constructor(repository: IReportDashboardRepository) {
    this.repository = repository;
  }

  async execute(month: string): Promise<GlobalStatsReport> {
    return this.repository.getGlobalStatsReport(month);
  }
}
