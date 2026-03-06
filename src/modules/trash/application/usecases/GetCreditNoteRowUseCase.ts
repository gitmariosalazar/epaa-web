import type { DateRangeParams } from '../../domain/dto/params/DateRangeParams';
import type { CreditNoteRow } from '../../domain/models/trash-rate-report.model';
import type { InterfaceTrashRateReportRepository } from '../../domain/repositories/trash-rate-report.interface.repository';

export class GetCreditNoteRowUseCase {
  private readonly trashRateReportRepository: InterfaceTrashRateReportRepository;

  constructor(trashRateReportRepository: InterfaceTrashRateReportRepository) {
    this.trashRateReportRepository = trashRateReportRepository;
  }

  async execute(params: DateRangeParams): Promise<CreditNoteRow[]> {
    const modelResult: CreditNoteRow[] =
      await this.trashRateReportRepository.getActiveCreditNotes(params);

    return modelResult;
  }
}
