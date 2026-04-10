import type { GeneralCollectionsParams } from '../../../domain/dto/params/DataEntryParams';
import type { GeneralCollectionRepository } from '../../../domain/repositories/GeneralCollectionRepository';
import type { GeneralCollectionResponse } from '../../../domain/models/GenelarCollection';

export class GetGeneralCollectionReportUseCase {
  private readonly repository: GeneralCollectionRepository;

  constructor(repository: GeneralCollectionRepository) {
    this.repository = repository;
  }

  async execute(params: GeneralCollectionsParams): Promise<GeneralCollectionResponse[]> {
    return this.repository.getGeneralCollectionReport(params);
  }
}
