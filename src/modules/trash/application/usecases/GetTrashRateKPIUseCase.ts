import type { TrashRateKPI } from '../../domain/models/trash-rate-report.model';
import type { DateRangeParams } from '../../domain/dto/params/DateRangeParams';
import type { InterfaceTrashRateReportRepository } from '../../domain/repositories/trash-rate-report.interface.repository';

export class GetTrashRateKPIUseCase {
  private readonly trashRateReportRepository: InterfaceTrashRateReportRepository;
  constructor(trashRateReportRepository: InterfaceTrashRateReportRepository) {
    this.trashRateReportRepository = trashRateReportRepository;
  }

  async execute(params: DateRangeParams): Promise<TrashRateKPI[]> {
    const result: TrashRateKPI[] =
      await this.trashRateReportRepository.getTrashRateKPI(params);
    return result;
  }
}
