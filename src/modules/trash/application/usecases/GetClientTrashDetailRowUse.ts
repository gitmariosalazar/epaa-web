import type { ClientTrashDetailRow } from '../../domain/models/trash-rate-report.model';
import type { InterfaceTrashRateReportRepository } from '../../domain/repositories/trash-rate-report.interface.repository';

export class GetClientTrashDetailRowUseCase {
  private readonly trashRateReportRepository: InterfaceTrashRateReportRepository;

  constructor(trashRateReportRepository: InterfaceTrashRateReportRepository) {
    this.trashRateReportRepository = trashRateReportRepository;
  }

  async execute(searchParams: string): Promise<ClientTrashDetailRow[]> {
    const modelResult: ClientTrashDetailRow[] =
      await this.trashRateReportRepository.getClientDetailSearch(searchParams);

    return modelResult;
  }
}
