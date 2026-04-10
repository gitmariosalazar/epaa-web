import type { GeneralTrendCollectionsParams } from '../../../domain/dto/params/DataEntryParams';
import type { GeneralCollectionRepository } from '../../../domain/repositories/GeneralCollectionRepository';
import type { GeneralMonthlyGroupedReportResponse } from '../../../domain/models/GenelarCollection';

export class GetGeneralMonthlyCollectionGroupedReportUseCase {
  private readonly repository: GeneralCollectionRepository;

  constructor(repository: GeneralCollectionRepository) {
    this.repository = repository;
  }

  async execute(params: GeneralTrendCollectionsParams): Promise<GeneralMonthlyGroupedReportResponse[]> {
    return this.repository.getGeneralMonthlyCollectionGroupedReport(params);
  }
}
