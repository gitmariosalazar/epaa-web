import type { SolicitudRepository, EmitInstallationOrderDto } from '../../domain/repositories/SolicitudRepository';

export class EmitInstallationOrderUseCase {
  private readonly repo: SolicitudRepository;
  constructor(repo: SolicitudRepository) { this.repo = repo; }
  execute(dto: EmitInstallationOrderDto): Promise<void> { return this.repo.emitInstallationOrder(dto); }
}
