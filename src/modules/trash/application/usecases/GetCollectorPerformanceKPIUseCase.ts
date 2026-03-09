import type { CollectorPerformanceKPI } from '../../domain/models/trash-rate-report.model';
import type { DateRangeParams } from '../../domain/dto/params/DateRangeParams';
import type { InterfaceTrashRateReportRepository } from '../../domain/repositories/trash-rate-report.interface.repository';

export class GetCollectorPerformanceKPIUseCase {
  private readonly trashRateReportRepository: InterfaceTrashRateReportRepository;
  constructor(trashRateReportRepository: InterfaceTrashRateReportRepository) {
    this.trashRateReportRepository = trashRateReportRepository;
  }

  async execute(params: DateRangeParams): Promise<CollectorPerformanceKPI[]> {
    const result: CollectorPerformanceKPI[] =
      await this.trashRateReportRepository.getCollectorPerformanceKPI(params);
    return result;
  }
}
