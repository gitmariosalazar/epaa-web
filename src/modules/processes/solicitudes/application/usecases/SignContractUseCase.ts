import type { SolicitudRepository, SignContractDto } from '../../domain/repositories/SolicitudRepository';

export class SignContractUseCase {
  private readonly repo: SolicitudRepository;
  constructor(repo: SolicitudRepository) { this.repo = repo; }
  execute(dto: SignContractDto): Promise<void> { return this.repo.signContract(dto); }
}
