import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { CreateQualityControlCommand } from '../../domain/schemas/dto/process-work-order.commands';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';

export class CreateQualityControlUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    createQualityControlCommand: CreateQualityControlCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const result = await this.processWorkOrderRepository.createQualityControl(
      createQualityControlCommand
    );
    return result;
  }
}
