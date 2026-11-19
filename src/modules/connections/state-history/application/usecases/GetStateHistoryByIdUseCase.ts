import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import type { StateHistory } from '../../domain/models/StateHistory';

export class GetStateHistoryByIdUseCase {
  private readonly repository: StateHistoryRepository;

  constructor(repository: StateHistoryRepository) {
    this.repository = repository;
  }

  async execute(historialId: number): Promise<StateHistory> {
    if (!historialId || isNaN(Number(historialId))) {
      throw new Error('El ID de historial es obligatorio.');
    }
    return this.repository.getStateHistoryById(Number(historialId));
  }
}
