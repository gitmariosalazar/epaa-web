/**
 * SubmitInspectionReportUseCase (work-orders) — Application Layer
 *
 * Clean Architecture:
 *   - Orquesta la lógica de negocio sin conocer implementaciones.
 *   - Depende exclusivamente de la abstracción ProcessWorkOrderRepository.
 *
 * SOLID:
 *   SRP: única responsabilidad — enviar informe técnico de inspección de acometida.
 *   OCP: extensible sin modificar (nuevas validaciones vía nuevas reglas de negocio).
 *   DIP: recibe el repositorio vía inyección de dependencias.
 *
 * Cuándo usarlo:
 *   Solo cuando la OT tiene origen = 'SOLICITUD' y tipo = 'Inspección de Factibilidad'.
 *   El hook del backend avanzará automáticamente la acometidas.solicitud a INFORME_EN_REVISION.
 */
import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { SubmitInspectionReportCommand } from '../../domain/schemas/dto/commands/submit-inspection-report.command';

export class SubmitInspectionReportUseCase {
  private readonly repository: ProcessWorkOrderRepository;

  constructor(repository: ProcessWorkOrderRepository) {
    this.repository = repository;
  }

  async execute(cmd: SubmitInspectionReportCommand): Promise<void> {
    // ── Validaciones de dominio ─────────────────────────────────────────────
    if (!cmd.workOrderId?.trim()) {
      throw new Error('El ID de la orden de trabajo es requerido.');
    }
    if (!cmd.solicitudId?.trim()) {
      throw new Error('El ID de la solicitud de acometida es requerido.');
    }
    if (!cmd.technicianId?.trim()) {
      throw new Error('El ID del técnico es requerido.');
    }
    if (!['FACTIBLE', 'NO_FACTIBLE', 'CONDICIONADA'].includes(cmd.result)) {
      throw new Error(
        "El resultado debe ser 'FACTIBLE', 'NO_FACTIBLE' o 'CONDICIONADA'.",
      );
    }
    if (cmd.networkDistanceM !== undefined && cmd.networkDistanceM < 0) {
      throw new Error('La distancia a la red no puede ser negativa.');
    }
    if (cmd.materialCost !== undefined && cmd.materialCost < 0) {
      throw new Error('El costo de materiales no puede ser negativo.');
    }
    if (cmd.laborCost !== undefined && cmd.laborCost < 0) {
      throw new Error('El costo de mano de obra no puede ser negativo.');
    }

    // ── Delegación al repositorio ───────────────────────────────────────────
    await this.repository.submitInspectionReport(cmd);
  }
}
