import type { DateRangeParams } from '../../domain/dto/params/DateRangeParams';
import type { TrashDashboardKpi } from '../../domain/models/trash-rate-report.model';
import type { InterfaceTrashRateReportRepository } from '../../domain/repositories/trash-rate-report.interface.repository';

export class GetTrashDashboardKpiUseCase {
  private readonly trashRateReportRepository: InterfaceTrashRateReportRepository;

  constructor(trashRateReportRepository: InterfaceTrashRateReportRepository) {
    this.trashRateReportRepository = trashRateReportRepository;
  }

  async execute(params: DateRangeParams): Promise<TrashDashboardKpi[]> {
    const modelResult: TrashDashboardKpi[] =
      await this.trashRateReportRepository.getDashboardKPITrashRate(params);

    return modelResult;
  }
}
