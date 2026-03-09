import type { DailyCollectorDetail } from '../../domain/models/trash-rate-report.model';
import type { DateRangeParams } from '../../domain/dto/params/DateRangeParams';
import type { InterfaceTrashRateReportRepository } from '../../domain/repositories/trash-rate-report.interface.repository';

export class GetDailyCollectorDetailUseCase {
  private readonly trashRateReportRepository: InterfaceTrashRateReportRepository;
  constructor(trashRateReportRepository: InterfaceTrashRateReportRepository) {
    this.trashRateReportRepository = trashRateReportRepository;
  }

  async execute(params: DateRangeParams): Promise<DailyCollectorDetail[]> {
    const result: DailyCollectorDetail[] =
      await this.trashRateReportRepository.getDailyCollectorDetail(params);
    return result;
  }
}
