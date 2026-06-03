import type { SolicitudRepository, EmitInspectionOrderDto } from '../../domain/repositories/SolicitudRepository';

export class EmitInspectionOrderUseCase {
  private readonly repo: SolicitudRepository;
  constructor(repo: SolicitudRepository) { this.repo = repo; }
  execute(dto: EmitInspectionOrderDto): Promise<void> { return this.repo.emitInspectionOrder(dto); }
}
