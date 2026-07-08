import type { Position } from '../models/Position';

export interface PositionRepository {
  findAll(): Promise<Position[]>;
  findById(positionId: number): Promise<Position>;
  createPosition(position: Omit<Position, 'positionId' | 'creationDate' | 'updatedAt'>): Promise<Position>;
  updatePosition(positionId: number, position: Partial<Position>): Promise<Position>;
  disablePosition(positionId: number): Promise<boolean>;
}
