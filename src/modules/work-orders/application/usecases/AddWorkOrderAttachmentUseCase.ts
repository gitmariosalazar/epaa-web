import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { AddWorkOrderAttachmentCommand } from '../../domain/schemas/dto/process-work-order.commands';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';

export class AddWorkOrderAttachmentUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    addWorkOrderAttachmentCommand: AddWorkOrderAttachmentCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const result = await this.processWorkOrderRepository.addWorkOrderAttachment(
      addWorkOrderAttachmentCommand
    );
    return result;
  }
}
