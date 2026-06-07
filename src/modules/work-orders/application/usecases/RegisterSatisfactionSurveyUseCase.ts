import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { RegisterSatisfactionSurveyCommand } from '../../domain/schemas/dto/process-work-order.commands';
import type { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';

export class RegisterSatisfactionSurveyUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    registerSatisfactionSurveyCommand: RegisterSatisfactionSurveyCommand
  ): Promise<ProcessWorkOrderResponse | null> {
    const result =
      await this.processWorkOrderRepository.registerSatisfactionSurvey(
        registerSatisfactionSurveyCommand
      );
    return result;
  }
}
