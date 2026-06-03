import type { SolicitudRepository, RegisterCadastralDto } from '../../domain/repositories/SolicitudRepository';
export class RegisterCadastralUseCase {
  constructor(private readonly repo: SolicitudRepository) {}
  execute(dto: RegisterCadastralDto): Promise<void> { return this.repo.registerCadastral(dto); }
}
