import type { DepartmentResponse } from '../../domain/schemas/dto/response/work-orders.get.response';
import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';

export class GetAllDepartmentsUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(): Promise<DepartmentResponse[]> {
    return await this.processWorkOrderRepository.getAllDepartments();
  }
}
