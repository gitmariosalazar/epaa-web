import type { IReportDashboardRepository } from '@/modules/dashboard/domain/repositories/report-dashboard.repository';
import type { SectorStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';

export class GetSectorStatsUseCase {
  private readonly repository: IReportDashboardRepository;

  constructor(repository: IReportDashboardRepository) {
    this.repository = repository;
  }

  async execute(month: string): Promise<SectorStatsReport[]> {
    return this.repository.getSectorStatsReport(month);
  }
}
