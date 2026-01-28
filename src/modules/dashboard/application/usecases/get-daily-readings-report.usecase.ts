import type { IReportDashboardRepository } from '@/modules/dashboard/domain/repositories/report-dashboard.repository';
import type { DailyReadingsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';

export class GetDailyReadingsReportUseCase {
  private readonly repository: IReportDashboardRepository;

  constructor(repository: IReportDashboardRepository) {
    this.repository = repository;
  }

  async execute(date: string): Promise<DailyReadingsReport[]> {
    return this.repository.getDailyReadingsReport(date);
  }
}
