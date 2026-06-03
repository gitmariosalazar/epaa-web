import type { SuspensionRepository } from '../../domain/repositories/SuspensionRepository';
import type { Suspension } from '../../domain/models/Suspension';
export class GetSuspensionRequisitosUseCase {
  private readonly repo: SuspensionRepository;
  constructor(repo: SuspensionRepository) { this.repo = repo; }
  async execute(): Promise<Suspension> { return this.repo.get(); }
}
