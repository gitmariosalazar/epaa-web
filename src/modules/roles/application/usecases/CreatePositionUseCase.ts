import type { Position } from '@/modules/roles/domain/models/Position';
import type { PositionRepository } from '@/modules/roles/domain/repositories/PositionRepository';
import { PositionRepositoryImpl } from '@/modules/roles/infrastructure/repositories/PositionRepositoryImpl';

export class CreatePositionUseCase {
  private repository: PositionRepository;

  constructor(repository: PositionRepository = new PositionRepositoryImpl()) {
    this.repository = repository;
  }

  async execute(position: Omit<Position, 'positionId' | 'creationDate' | 'updatedAt'>): Promise<Position> {
    return this.repository.createPosition(position);
  }
}
