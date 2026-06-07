import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';
import type { ProcessWorkOrderRequest } from '../../domain/schemas/dto/request/process-work-order.request';

export class MarkWorkOrderExecutionStartedUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    markWorkOrderExecutionStartedCommand: ProcessWorkOrderRequest
  ): Promise<ProcessWorkOrderResponse | null> {
    const result =
      await this.processWorkOrderRepository.markWorkOrderExecutionStarted(
        markWorkOrderExecutionStartedCommand
      );
    return result;
  }
}
