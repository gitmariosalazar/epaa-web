import type { SolicitudRepository, RegisterCadastralDto } from '../../domain/repositories/SolicitudRepository';

export class RegisterCadastralUseCase {
  private readonly repo: SolicitudRepository;
  constructor(repo: SolicitudRepository) { this.repo = repo; }
  execute(dto: RegisterCadastralDto): Promise<void> { return this.repo.registerCadastral(dto); }
}
