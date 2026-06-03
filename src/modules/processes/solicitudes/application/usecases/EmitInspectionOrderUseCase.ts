/**
 * EmitInspectionOrderUseCase — Fase 6
 * SRP: solo emite la OT de inspección.
 * DIP: depende de SolicitudRepository (interfaz), no de la implementación.
 */
import type { SolicitudRepository, EmitInspectionOrderDto } from '../../domain/repositories/SolicitudRepository';

export class EmitInspectionOrderUseCase {
  constructor(private readonly repo: SolicitudRepository) {}
  execute(dto: EmitInspectionOrderDto): Promise<void> {
    return this.repo.emitInspectionOrder(dto);
  }
}
