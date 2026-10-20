/**
 * ExecuteAutoStepUseCase — Ejecuta un paso automático del proceso de OT.
 *
 * Clean Architecture — Application layer.
 *
 * Principios SOLID:
 *   - SRP: única responsabilidad: ejecutar el paso automático correspondiente en el repositorio.
 *   - OCP: nuevos pasos automáticos se agregan aquí sin modificar la UI ni el repositorio.
 *   - DIP: depende de la interfaz ProcessWorkOrderRepository, no de la implementación concreta.
 */
import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { OrdenTrabajoDetalle } from '../../domain/schemas/dto/response/work-orders.get.response';
import {
  type AutoStep,
  AutoStepDefaults,
} from '../../domain/automation/WorkOrderAutomationPolicy';
import { ProcessWorkOrderRequest } from '../../domain/schemas/dto/request/process-work-order.request';

export class ExecuteAutoStepUseCase {
  private readonly repository: ProcessWorkOrderRepository;

  constructor(repository: ProcessWorkOrderRepository) {
    this.repository = repository;
  }

  async execute(
    step: AutoStep,
    order: OrdenTrabajoDetalle,
    userId: string
  ): Promise<void> {
    switch (step) {
      case 'receive': {
        const req = new ProcessWorkOrderRequest(
          order.idOrdenTrabajo,
          'PENDIENTE',
          userId,
          'OT recepcionada desde la plataforma web'
        );
        await this.repository.receiveWorkOrder(req);
        break;
      }
      case 'startPreparation': {
        const req = new ProcessWorkOrderRequest(
          order.idOrdenTrabajo,
          'PREPARACION',
          userId,
          'Inicio de preparación de campo'
        );
        await this.repository.startPreparation(req);
        break;
      }
      case 'createChecklist': {
        await this.repository.createPreparationInspection({
          workOrderId: order.idOrdenTrabajo,
          createdByUserId: userId,
          passed: true,
          observations: AutoStepDefaults.checklistObservations,
        });
        break;
      }
      case 'approveChecklist': {
        const req = new ProcessWorkOrderRequest(
          order.idOrdenTrabajo,
          'EN_PROCESO',
          userId,
          AutoStepDefaults.checklistApproval
        );
        await this.repository.resolvePreparationInspection(req);
        break;
      }
      case 'restartPreparation': {
        const req = new ProcessWorkOrderRequest(
          order.idOrdenTrabajo,
          'PREPARACION',
          userId,
          'Reinicio de preparación tras corrección'
        );
        await this.repository.startPreparation(req);
        break;
      }
      case 'finishExecution': {
        const estadoUpper = (order.estado ?? '').toUpperCase();
        const nextStatus =
          estadoUpper === 'EN_PROCESO_INSPECCION'
            ? 'INSPECCION_EJECUTADA'
            : estadoUpper === 'EN_PROCESO_INSTALACION'
            ? 'INSTALACION_EJECUTADA'
            : 'EJECUTADA';

        const req = new ProcessWorkOrderRequest(
          order.idOrdenTrabajo,
          nextStatus,
          userId,
          'Trabajo técnico finalizado en campo'
        );
        await this.repository.finishExecution(req);
        break;
      }
      case 'qualityControl': {
        await this.repository.createQualityControl({
          workOrderId: order.idOrdenTrabajo,
          createdByUserId: userId,
          approved: true,
          comments: AutoStepDefaults.qualityControlComments,
        });
        break;
      }
      default: {
        const exhaustiveCheck: never = step;
        throw new Error(`Paso automático no soportado: ${exhaustiveCheck}`);
      }
    }
  }
}
