import type { SolicitudRepository, EmitInstallationOrderDto } from '../../domain/repositories/SolicitudRepository';
export class EmitInstallationOrderUseCase {
  constructor(private readonly repo: SolicitudRepository) {}
  execute(dto: EmitInstallationOrderDto): Promise<void> { return this.repo.emitInstallationOrder(dto); }
}
