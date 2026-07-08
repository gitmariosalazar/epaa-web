import type { Position } from '@/modules/roles/domain/models/Position';
import type { PositionRepository } from '@/modules/roles/domain/repositories/PositionRepository';
import { PositionRepositoryImpl } from '@/modules/roles/infrastructure/repositories/PositionRepositoryImpl';

export class UpdatePositionUseCase {
  private repository: PositionRepository;

  constructor(repository: PositionRepository = new PositionRepositoryImpl()) {
    this.repository = repository;
  }

  async execute(positionId: number, position: Partial<Position>): Promise<Position> {
    return this.repository.updatePosition(positionId, position);
  }
}
