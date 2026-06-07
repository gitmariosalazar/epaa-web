import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { CreateWorkOrderCommand } from '../../domain/schemas/dto/process-work-order.commands';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';

export class CreateWorkOrderUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    createWorkOrderCommand: CreateWorkOrderCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const result = await this.processWorkOrderRepository.createWorkOrder(
      createWorkOrderCommand
    );
    return result;
  }
}
