import type { SuspensionRepository } from '../../domain/repositories/SuspensionRepository';
import type { Suspension } from '../../domain/models/Suspension';
import { SUSPENSION_DATA } from '../data/SuspensionRequisitos';

export class SuspensionRepositoryImpl implements SuspensionRepository {
  async get(): Promise<Suspension> { return SUSPENSION_DATA; }
}
