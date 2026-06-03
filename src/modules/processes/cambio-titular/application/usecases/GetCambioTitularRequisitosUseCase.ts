import type { CambioTitularRepository } from '../../domain/repositories/CambioTitularRepository';
import type { CambioTitular } from '../../domain/models/CambioTitular';
export class GetCambioTitularRequisitosUseCase {
  private readonly repo: CambioTitularRepository;
  constructor(repo: CambioTitularRepository) { this.repo = repo; }
  async execute(): Promise<CambioTitular> { return this.repo.get(); }
}
