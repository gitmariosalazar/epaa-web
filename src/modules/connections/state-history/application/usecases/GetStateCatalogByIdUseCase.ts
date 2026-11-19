import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import type { StateCatalogItem } from '../../domain/models/StateCatalog';

export class GetStateCatalogByIdUseCase {
  private readonly repository: StateHistoryRepository;

  constructor(repository: StateHistoryRepository) {
    this.repository = repository;
  }

  async execute(stateId: number): Promise<StateCatalogItem> {
    if (!stateId || isNaN(Number(stateId))) {
      throw new Error('El ID de estado es obligatorio.');
    }
    return this.repository.getStateCatalogById(Number(stateId));
  }
}
