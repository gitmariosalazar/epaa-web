import type { IReportDashboardRepository } from '@/modules/dashboard/domain/repositories/report-dashboard.repository';
import type { YearlyReadingsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';

export class GetYearlyReadingsReportUseCase {
  private readonly repository: IReportDashboardRepository;

  constructor(repository: IReportDashboardRepository) {
    this.repository = repository;
  }

  async execute(year: number): Promise<YearlyReadingsReport> {
    return this.repository.getYearlyReadingsReport(year);
  }
}
