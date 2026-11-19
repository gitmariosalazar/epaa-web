import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import type { AllowedTransitions } from '../../domain/models/AllowedTransitions';

export class GetAllowedTransitionsUseCase {
  private readonly repository: StateHistoryRepository;

  constructor(repository: StateHistoryRepository) {
    this.repository = repository;
  }

  async execute(connectionId: string): Promise<AllowedTransitions> {
    if (!connectionId?.trim()) {
      throw new Error('El ID de acometida es obligatorio.');
    }
    return this.repository.getAllowedTransitions(connectionId.trim());
  }
}
