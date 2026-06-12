/**
 * AdvanceWorkOrderUseCase — Avanza el estado de una OT a cualquier estado válido.
 *
 * SRP: única responsabilidad — solicitar el cambio de estado de una OT.
 * DIP: depende de ProcessWorkOrderRepository (interface), no de la implementación.
 *
 * IMPORTANTE: NO usa receiveWorkOrder() porque el gateway hardcodea newStatus='PENDIENTE'.
 * Usa advanceState() que llama a POST /process-work-orders/advance-state — un endpoint
 * dedicado que pasa newStatus exactamente como viene del cliente autenticado.
 *
 * La validación de la transición ocurre en PostgreSQL vía fn_validar_transicion_estado().
 * Si la transición no es válida, el backend lanza un error 400 que el componente muestra.
 */
import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';

export interface AdvanceWorkOrderCommand {
  workOrderId: string;
  newStatus:   string;
  userId:      string;
  comment:     string;
}

export class AdvanceWorkOrderUseCase {
  // Declaración explícita de propiedad — requerida cuando erasableSyntaxOnly está activo
  private readonly repository: ProcessWorkOrderRepository;

  constructor(repository: ProcessWorkOrderRepository) {
    this.repository = repository;
  }

  async execute(cmd: AdvanceWorkOrderCommand): Promise<void> {
    await (this.repository as any).advanceState({
      workOrderId: cmd.workOrderId,
      newStatus:   cmd.newStatus,
      userId:      cmd.userId,
      comment:     cmd.comment,
    });
  }
}
