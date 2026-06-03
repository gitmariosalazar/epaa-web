import type { BeneficioTerceraEdadRepository } from '../../domain/repositories/BeneficioTerceraEdadRepository';
import type { BeneficioTerceraEdad } from '../../domain/models/BeneficioTerceraEdad';
export class GetBeneficioTerceraEdadRequisitosUseCase {
  private readonly repo: BeneficioTerceraEdadRepository;
  constructor(repo: BeneficioTerceraEdadRepository) { this.repo = repo; }
  async execute(): Promise<BeneficioTerceraEdad> { return this.repo.get(); }
}
