import type { DateRangeParams } from '../../domain/dto/params/DateRangeParams';
import type { MonthlySummaryRow } from '../../domain/models/trash-rate-report.model';
import type { InterfaceTrashRateReportRepository } from '../../domain/repositories/trash-rate-report.interface.repository';

export class GetMonthlySummaryRowUseCase {
  private readonly trashRateReportRepository: InterfaceTrashRateReportRepository;

  constructor(trashRateReportRepository: InterfaceTrashRateReportRepository) {
    this.trashRateReportRepository = trashRateReportRepository;
  }

  async execute(params: DateRangeParams): Promise<MonthlySummaryRow[]> {
    const modelResult: MonthlySummaryRow[] =
      await this.trashRateReportRepository.getMonthlySummaryReport(params);

    return modelResult;
  }
}
