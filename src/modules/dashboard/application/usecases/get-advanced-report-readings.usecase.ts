import type { AdvancedReportReadings } from '../../domain/models/report-dashboard.model';
import type { IReportDashboardRepository } from '../../domain/repositories/report-dashboard.repository';

export class GetAdvancedReportReadingsUseCase {
  private readonly repository: IReportDashboardRepository;

  constructor(repository: IReportDashboardRepository) {
    this.repository = repository;
  }

  async execute(month: string): Promise<AdvancedReportReadings[]> {
    return this.repository.getAdvancedReportReadings(month);
  }
}
