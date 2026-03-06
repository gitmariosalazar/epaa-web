import type { DateRangeParams } from '../../domain/dto/params/DateRangeParams';
import type { MissingValorRow } from '../../domain/models/trash-rate-report.model';
import type { InterfaceTrashRateReportRepository } from '../../domain/repositories/trash-rate-report.interface.repository';

export class GetMissingValorRowUseCase {
  private readonly trashRateReportRepository: InterfaceTrashRateReportRepository;

  constructor(trashRateReportRepository: InterfaceTrashRateReportRepository) {
    this.trashRateReportRepository = trashRateReportRepository;
  }

  async execute(params: DateRangeParams): Promise<MissingValorRow[]> {
    const modelResult: MissingValorRow[] =
      await this.trashRateReportRepository.getMissingValorBills(params);

    return modelResult;
  }
}
