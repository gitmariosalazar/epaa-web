import type { IReportDashboardRepository } from '@/modules/dashboard/domain/repositories/report-dashboard.repository';
import type { NoveltyStatsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';

export class GetNoveltyStatsUseCase {
  private readonly repository: IReportDashboardRepository;

  constructor(repository: IReportDashboardRepository) {
    this.repository = repository;
  }

  async execute(month: string): Promise<NoveltyStatsReport[]> {
    return this.repository.getNoveltyStatsReport(month);
  }
}
