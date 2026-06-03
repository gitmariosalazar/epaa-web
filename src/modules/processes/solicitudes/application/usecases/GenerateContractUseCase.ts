import type { SolicitudRepository, GenerateContractDto } from '../../domain/repositories/SolicitudRepository';

export class GenerateContractUseCase {
  private readonly repo: SolicitudRepository;
  constructor(repo: SolicitudRepository) { this.repo = repo; }
  execute(dto: GenerateContractDto): Promise<void> { return this.repo.generateContract(dto); }
}
