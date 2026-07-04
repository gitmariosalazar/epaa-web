import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';
import type { AddWorkersBatchToWorkOrderCommand } from '../../domain/schemas/dto/process-work-order.commands';

export class AddWorkersBatchToWorkOrderUseCase {
  private readonly repository: ProcessWorkOrderRepository;

  constructor(repository: ProcessWorkOrderRepository) {
    this.repository = repository;
  }

  async execute(
    command: AddWorkersBatchToWorkOrderCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    if (!command.workOrderId) {
      throw new Error('El workOrderId es obligatorio.');
    }
    if (!command.workers || command.workers.length === 0) {
      throw new Error('Debe asignar al menos un trabajador.');
    }
    return this.repository.addWorkersBatchToWorkOrder(command);
  }
}
