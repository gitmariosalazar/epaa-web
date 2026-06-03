import type { BeneficioDiscapacidadRepository } from '../../domain/repositories/BeneficioDiscapacidadRepository';
import type { BeneficioDiscapacidad } from '../../domain/models/BeneficioDiscapacidad';
export class GetBeneficioDiscapacidadRequisitosUseCase {
  private readonly repo: BeneficioDiscapacidadRepository;
  constructor(repo: BeneficioDiscapacidadRepository) { this.repo = repo; }
  async execute(): Promise<BeneficioDiscapacidad> { return this.repo.get(); }
}
