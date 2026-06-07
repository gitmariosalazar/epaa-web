import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';
import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { ProcessWorkOrderRequest } from '../../domain/schemas/dto/request/process-work-order.request';

export class ResolveQualityControlUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    resolveQualityControlCommand: ProcessWorkOrderRequest
  ): Promise<ProcessWorkOrderResponse | null> {
    const result = await this.processWorkOrderRepository.resolveQualityControl(
      resolveQualityControlCommand
    );
    return result;
  }
}
