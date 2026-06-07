import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { AddAdditionalCostCommand } from '../../domain/schemas/dto/process-work-order.commands';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';

export class AddAdditionalCostUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    addAdditionalCostCommand: AddAdditionalCostCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const result = await this.processWorkOrderRepository.addAdditionalCost(
      addAdditionalCostCommand
    );
    return result;
  }
}
