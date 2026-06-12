import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { AddWorkerToWorkOrderCommand } from '../../domain/schemas/dto/process-work-order.commands';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';

export class AddWorkerToWorkOrderUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    cmd: AddWorkerToWorkOrderCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.processWorkOrderRepository.addWorkerToWorkOrder(cmd);
  }
}
