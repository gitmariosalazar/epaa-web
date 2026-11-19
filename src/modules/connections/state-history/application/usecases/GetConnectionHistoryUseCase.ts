import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import type { StateHistory } from '../../domain/models/StateHistory';

export class GetConnectionHistoryUseCase {
  private readonly repository: StateHistoryRepository;

  constructor(repository: StateHistoryRepository) {
    this.repository = repository;
  }

  async execute(
    connectionId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<StateHistory[]> {
    if (!connectionId?.trim()) {
      throw new Error('El ID de acometida es obligatorio.');
    }
    return this.repository.getConnectionHistory(connectionId.trim(), limit, offset);
  }
}
