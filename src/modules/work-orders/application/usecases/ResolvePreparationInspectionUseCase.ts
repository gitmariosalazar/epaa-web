import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';
import type { ProcessWorkOrderRequest } from '../../domain/schemas/dto/request/process-work-order.request';
import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';

export class ResolvePreparationInspectionUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    resolvePreparationInspectionCommand: ProcessWorkOrderRequest
  ): Promise<ProcessWorkOrderResponse | null> {
    const result =
      await this.processWorkOrderRepository.resolvePreparationInspection(
        resolvePreparationInspectionCommand
      );
    return result;
  }
}
