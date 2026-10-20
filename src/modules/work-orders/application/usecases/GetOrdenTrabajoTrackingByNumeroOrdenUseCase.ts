import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { OrdenTrabajoTracking } from '../../domain/schemas/dto/response/work-orders.get.response';

export class GetOrdenTrabajoTrackingByNumeroOrdenUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(searchValue: string): Promise<OrdenTrabajoTracking[]> {
    const result =
      await this.processWorkOrderRepository.getOrdenTrabajoTrackingByNumeroOrden(
        searchValue
      );
    return result;
  }
}
