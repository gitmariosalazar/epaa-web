import type { GeneralCollectionsParams } from '../../../domain/dto/params/DataEntryParams';
import type { GeneralCollectionRepository } from '../../../domain/repositories/GeneralCollectionRepository';
import type { GeneralKPIResponse } from '../../../domain/models/GenelarCollection';

export class GetGeneralCollectionKPIUseCase {
  private readonly repository: GeneralCollectionRepository;

  constructor(repository: GeneralCollectionRepository) {
    this.repository = repository;
  }

  async execute(params: GeneralCollectionsParams): Promise<GeneralKPIResponse | null> {
    return this.repository.getGeneralCollectionKPI(params);
  }
}
