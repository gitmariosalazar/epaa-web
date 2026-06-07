import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';
import type { ProcessWorkOrderModel } from '../../domain/schemas/models/process-work-order.model';

export class ProcessWorkOrderUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    processWorkOrderCommand: ProcessWorkOrderModel
  ): Promise<ProcessWorkOrderResponse | null> {
    const result = await this.processWorkOrderRepository.processWorkOrder(
      processWorkOrderCommand
    );
    return result;
  }
}
