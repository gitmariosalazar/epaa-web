import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { RemoveWorkerFromWorkOrderCommand } from '../../domain/schemas/dto/process-work-order.commands';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';

export class RemoveWorkerFromWorkOrderUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    cmd: RemoveWorkerFromWorkOrderCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.processWorkOrderRepository.removeWorkerFromWorkOrder(cmd);
  }
}
