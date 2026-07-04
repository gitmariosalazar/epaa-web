import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';
import type { AddWorkOrderMaterialsBatchCommand } from '../../domain/schemas/dto/process-work-order.commands';

export class AddWorkOrderMaterialsBatchUseCase {
  private readonly repository: ProcessWorkOrderRepository;

  constructor(repository: ProcessWorkOrderRepository) {
    this.repository = repository;
  }

  async execute(
    command: AddWorkOrderMaterialsBatchCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    if (!command.workOrderId) {
      throw new Error('El workOrderId es obligatorio.');
    }
    if (!command.materials || command.materials.length === 0) {
      throw new Error('Debe enviar al menos un material en el lote.');
    }
    return this.repository.addWorkOrderMaterialsBatch(command);
  }
}
