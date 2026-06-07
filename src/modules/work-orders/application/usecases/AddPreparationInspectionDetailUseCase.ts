import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { AddPreparationInspectionDetailCommand } from '../../domain/schemas/dto/process-work-order.commands';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';

export class AddPreparationInspectionDetailUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    addPreparationInspectionDetailCommand: AddPreparationInspectionDetailCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const result =
      await this.processWorkOrderRepository.addPreparationInspectionDetail(
        addPreparationInspectionDetailCommand
      );
    return result;
  }
}
