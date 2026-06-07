import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { CreatePreparationInspectionCommand } from '../../domain/schemas/dto/process-work-order.commands';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';

export class CreatePreparationInspectionUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    createPreparationInspectionCommand: CreatePreparationInspectionCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const result =
      await this.processWorkOrderRepository.createPreparationInspection(
        createPreparationInspectionCommand
      );
    return result;
  }
}
