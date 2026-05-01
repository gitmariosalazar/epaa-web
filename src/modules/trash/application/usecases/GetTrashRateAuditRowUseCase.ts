import type { ParamsTrashRateAudit } from '../../domain/dto/params/DateRangeParams';
import type { TrashRateAuditRow } from '../../domain/models/trash-rate-report.model';
import type { InterfaceTrashRateReportRepository } from '../../domain/repositories/trash-rate-report.interface.repository';

export class GetTrashRateAuditRowUseCase {
  private readonly trashRateReportRepository: InterfaceTrashRateReportRepository;

  constructor(trashRateReportRepository: InterfaceTrashRateReportRepository) {
    this.trashRateReportRepository = trashRateReportRepository;
  }

  async execute(params: ParamsTrashRateAudit): Promise<TrashRateAuditRow[]> {
    const modelResult: TrashRateAuditRow[] =
      await this.trashRateReportRepository.getTrashRateAuditReport(params);

    return modelResult;
  }
}
