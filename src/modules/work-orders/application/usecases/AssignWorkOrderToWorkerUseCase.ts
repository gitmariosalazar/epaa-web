import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { AssignWorkOrderToWorkerCommand } from '../../domain/schemas/dto/process-work-order.commands';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';

export class AssignWorkOrderToWorkerUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    assignWorkOrderToWorkerCommand: AssignWorkOrderToWorkerCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const result =
      await this.processWorkOrderRepository.assignWorkOrderToWorker(
        assignWorkOrderToWorkerCommand
      );
    return result;
  }
}
