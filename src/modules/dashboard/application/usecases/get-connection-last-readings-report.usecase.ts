import type { IReportDashboardRepository } from '@/modules/dashboard/domain/repositories/report-dashboard.repository';
import type { ConnectionLastReadingsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';

export class GetConnectionLastReadingsReportUseCase {
  private readonly repository: IReportDashboardRepository;

  constructor(repository: IReportDashboardRepository) {
    this.repository = repository;
  }

  async execute(
    cadastralKey: string,
    limit: number
  ): Promise<ConnectionLastReadingsReport[]> {
    return this.repository.getConnectionLastReadingsReport(cadastralKey, limit);
  }
}
