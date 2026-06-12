import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';
import type { ProcessWorkOrderRequest } from '../../domain/schemas/dto/request/process-work-order.request';
import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';

export class FinishExecutionUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    finishExecutionCommand: ProcessWorkOrderRequest
  ): Promise<ProcessWorkOrderResponse | null> {
    const result =
      await this.processWorkOrderRepository.finishExecution(
        finishExecutionCommand
      );
    return result;
  }
}
