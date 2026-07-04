import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';
import type { AddAdditionalCostsBatchCommand } from '../../domain/schemas/dto/process-work-order.commands';

export class AddAdditionalCostsBatchUseCase {
  private readonly repository: ProcessWorkOrderRepository;

  constructor(repository: ProcessWorkOrderRepository) {
    this.repository = repository;
  }

  async execute(
    command: AddAdditionalCostsBatchCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    if (!command.workOrderId) {
      throw new Error('El workOrderId es obligatorio.');
    }
    if (!command.costs || command.costs.length === 0) {
      throw new Error('Debe enviar al menos un costo adicional en el lote.');
    }
    return this.repository.addAdditionalCostsBatch(command);
  }
}
