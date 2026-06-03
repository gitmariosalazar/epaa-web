import type { SolicitudRepository, SignContractDto } from '../../domain/repositories/SolicitudRepository';
export class SignContractUseCase {
  constructor(private readonly repo: SolicitudRepository) {}
  execute(dto: SignContractDto): Promise<void> { return this.repo.signContract(dto); }
}
