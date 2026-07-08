import type { PositionRepository } from '@/modules/roles/domain/repositories/PositionRepository';
import { PositionRepositoryImpl } from '@/modules/roles/infrastructure/repositories/PositionRepositoryImpl';

export class DisablePositionUseCase {
  private repository: PositionRepository;

  constructor(repository: PositionRepository = new PositionRepositoryImpl()) {
    this.repository = repository;
  }

  async execute(positionId: number): Promise<boolean> {
    return this.repository.disablePosition(positionId);
  }
}
