import type { GeneralTrendCollectionsParams } from '../../../domain/dto/params/DataEntryParams';
import type { GeneralCollectionRepository } from '../../../domain/repositories/GeneralCollectionRepository';
import type { GeneralYearlyKPIResponse } from '../../../domain/models/GenelarCollection';

export class GetGeneralYearlyCollectionKPIUseCase {
  private readonly repository: GeneralCollectionRepository;

  constructor(repository: GeneralCollectionRepository) {
    this.repository = repository;
  }

  async execute(params: GeneralTrendCollectionsParams): Promise<GeneralYearlyKPIResponse[]> {
    return this.repository.getGeneralYearlyCollectionKPI(params);
  }
}
