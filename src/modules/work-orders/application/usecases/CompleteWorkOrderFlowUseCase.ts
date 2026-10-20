/**
 * CompleteWorkOrderFlowUseCase — Orquesta el flujo completo de finalización y cierre.
 *
 * Clean Architecture — Application layer.
 *
 * Espejo exacto del método `completeWorkOrderFlow` de Mobile (WorkOrderProcessCubit).
 *
 * Principios SOLID:
 *   - SRP: encapsula el flujo ordenado de cierre (pasos automáticos previos + completeWorkOrder).
 *   - OCP: ampliable mediante WorkOrderAutomationPolicy sin modificar los repositorios.
 *   - DIP: depende de la abstracción ProcessWorkOrderRepository.
 */
import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { OrdenTrabajoDetalle } from '../../domain/schemas/dto/response/work-orders.get.response';
import {
  type WorkOrderAutomationPolicy,
  WorkOrderAutoStepResolver,
} from '../../domain/automation/WorkOrderAutomationPolicy';
import { ProcessWorkOrderRequest } from '../../domain/schemas/dto/request/process-work-order.request';
import { ExecuteAutoStepUseCase } from './ExecuteAutoStepUseCase';

export interface CompleteWorkOrderFlowParams {
  order: OrdenTrabajoDetalle;
  finalizationDescription: string;
  userId: string;
  policy: WorkOrderAutomationPolicy;
}

export class CompleteWorkOrderFlowUseCase {
  private readonly repository: ProcessWorkOrderRepository;
  private readonly executeAutoStepUseCase: ExecuteAutoStepUseCase;

  constructor(repository: ProcessWorkOrderRepository) {
    this.repository = repository;
    this.executeAutoStepUseCase = new ExecuteAutoStepUseCase(repository);
  }

  async execute({
    order,
    finalizationDescription,
    userId,
    policy,
  }: CompleteWorkOrderFlowParams): Promise<void> {
    const cleanDesc = finalizationDescription.trim();
    if (!cleanDesc) {
      throw new Error('La descripción de finalización del trabajo es obligatoria.');
    }

    // 1. Ejecutar pasos automáticos previos al cierre (finalizar ejecución, control de calidad)
    const completionSteps = WorkOrderAutoStepResolver.completionSteps(order, policy);
    for (const step of completionSteps) {
      await this.executeAutoStepUseCase.execute(step, order, userId);
    }

    // 2. Resolver nuevo estado final según la tipología
    const estadoUpper = (order.estado ?? '').toUpperCase();
    const nextStatus =
      estadoUpper === 'INSPECCION_EJECUTADA' || estadoUpper === 'EN_PROCESO_INSPECCION'
        ? 'INSPECCION_COMPLETADA'
        : estadoUpper === 'INSTALACION_EJECUTADA' || estadoUpper === 'EN_PROCESO_INSTALACION'
        ? 'INSTALACION_COMPLETADA'
        : 'COMPLETADA';

    // 3. Registrar el cierre formal en el backend
    const request = new ProcessWorkOrderRequest(
      order.idOrdenTrabajo,
      nextStatus,
      userId,
      'Cierre administrativo desde la plataforma web',
      cleanDesc
    );

    await this.repository.completeWorkOrder(request);
  }
}
