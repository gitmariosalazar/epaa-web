import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import type { StateCatalogItem } from '../../domain/models/StateCatalog';

export class GetStateCatalogUseCase {
  private readonly repository: StateHistoryRepository;

  constructor(repository: StateHistoryRepository) {
    this.repository = repository;
  }

  async execute(): Promise<StateCatalogItem[]> {
    return this.repository.getStateCatalog();
  }
}
