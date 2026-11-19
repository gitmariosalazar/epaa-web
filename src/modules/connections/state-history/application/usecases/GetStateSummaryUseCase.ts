import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import type { StateSummaryItem } from '../../domain/models/StateSummary';

export class GetStateSummaryUseCase {
  private readonly repository: StateHistoryRepository;

  constructor(repository: StateHistoryRepository) {
    this.repository = repository;
  }

  async execute(): Promise<StateSummaryItem[]> {
    return this.repository.getStateSummary();
  }
}
