import type { GeneralTrendCollectionsParams } from '../../../domain/dto/params/DataEntryParams';
import type { GeneralCollectionRepository } from '../../../domain/repositories/GeneralCollectionRepository';
import type { GeneralMonthlyKPIResponse } from '../../../domain/models/GenelarCollection';

export class GetGeneralMonthlyCollectionKPIUseCase {
  private readonly repository: GeneralCollectionRepository;

  constructor(repository: GeneralCollectionRepository) {
    this.repository = repository;
  }

  async execute(params: GeneralTrendCollectionsParams): Promise<GeneralMonthlyKPIResponse[]> {
    return this.repository.getGeneralMonthlyCollectionKPI(params);
  }
}
