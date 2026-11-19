import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';

export class GetConnectionsByStateUseCase {
  private readonly repository: StateHistoryRepository;

  constructor(repository: StateHistoryRepository) {
    this.repository = repository;
  }

  async execute(
    stateId: number,
    sectorId?: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<any> {
    if (!stateId || isNaN(Number(stateId))) {
      throw new Error('El ID de estado es obligatorio.');
    }
    return this.repository.getConnectionsByState(Number(stateId), sectorId, limit, offset);
  }
}
