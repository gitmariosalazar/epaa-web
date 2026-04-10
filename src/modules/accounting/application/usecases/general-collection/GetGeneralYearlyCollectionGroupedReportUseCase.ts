import type { GeneralTrendCollectionsParams } from '../../../domain/dto/params/DataEntryParams';
import type { GeneralCollectionRepository } from '../../../domain/repositories/GeneralCollectionRepository';
import type { GeneralYearlyGroupedReportResponse } from '../../../domain/models/GenelarCollection';

export class GetGeneralYearlyCollectionGroupedReportUseCase {
  private readonly repository: GeneralCollectionRepository;

  constructor(repository: GeneralCollectionRepository) {
    this.repository = repository;
  }

  async execute(params: GeneralTrendCollectionsParams): Promise<GeneralYearlyGroupedReportResponse[]> {
    return this.repository.getGeneralYearlyCollectionGroupedReport(params);
  }
}
