import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { AddWorkOrderMaterialCommand } from '../../domain/schemas/dto/process-work-order.commands';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';

export class AddWorkOrderMaterialUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    addWorkOrderMaterialCommand: AddWorkOrderMaterialCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const result = await this.processWorkOrderRepository.addWorkOrderMaterial(
      addWorkOrderMaterialCommand
    );
    return result;
  }
}
