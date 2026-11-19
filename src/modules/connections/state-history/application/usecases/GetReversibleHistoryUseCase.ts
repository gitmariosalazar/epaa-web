import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import type { ReversibleRecord } from '../../domain/models/ReversibleRecord';

export class GetReversibleHistoryUseCase {
  private readonly repository: StateHistoryRepository;

  constructor(repository: StateHistoryRepository) {
    this.repository = repository;
  }

  async execute(connectionId: string): Promise<ReversibleRecord> {
    if (!connectionId?.trim()) {
      throw new Error('El ID de acometida es obligatorio.');
    }
    return this.repository.getReversibleHistory(connectionId.trim());
  }
}
