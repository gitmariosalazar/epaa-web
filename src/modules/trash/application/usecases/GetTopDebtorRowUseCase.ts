import type { DateRangeParams } from '../../domain/dto/params/DateRangeParams';
import type { TopDebtorRow } from '../../domain/models/trash-rate-report.model';
import type { InterfaceTrashRateReportRepository } from '../../domain/repositories/trash-rate-report.interface.repository';

export class GetTopDebtorRowUseCase {
  private readonly trashRateReportRepository: InterfaceTrashRateReportRepository;

  constructor(trashRateReportRepository: InterfaceTrashRateReportRepository) {
    this.trashRateReportRepository = trashRateReportRepository;
  }

  async execute(params: DateRangeParams): Promise<TopDebtorRow[]> {
    const modelResult: TopDebtorRow[] =
      await this.trashRateReportRepository.getTopDebtorReport(params);

    return modelResult;
  }
}
