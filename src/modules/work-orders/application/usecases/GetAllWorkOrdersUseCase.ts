import type { WorkOrderListItem } from '../../domain/schemas/dto/response/work-orders.get.response';
import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';

export class GetAllWorkOrdersUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(
    searchValue?: string,
    limit?: number,
    offset?: number
  ): Promise<WorkOrderListItem[]> {
    return await this.processWorkOrderRepository.getAllWorkOrders(
      searchValue,
      limit,
      offset
    );
  }
}
