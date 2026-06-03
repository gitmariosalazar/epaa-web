import type { SolicitudRepository, GenerateContractDto } from '../../domain/repositories/SolicitudRepository';
export class GenerateContractUseCase {
  constructor(private readonly repo: SolicitudRepository) {}
  execute(dto: GenerateContractDto): Promise<void> { return this.repo.generateContract(dto); }
}
