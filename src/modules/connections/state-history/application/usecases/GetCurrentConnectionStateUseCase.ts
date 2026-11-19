import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import type { CurrentConnectionState } from '../../domain/models/CurrentConnectionState';

export class GetCurrentConnectionStateUseCase {
  private readonly repository: StateHistoryRepository;

  constructor(repository: StateHistoryRepository) {
    this.repository = repository;
  }

  async execute(connectionId: string): Promise<CurrentConnectionState> {
    if (!connectionId?.trim()) {
      throw new Error('El ID de acometida es obligatorio.');
    }
    return this.repository.getCurrentConnectionState(connectionId.trim());
  }
}
