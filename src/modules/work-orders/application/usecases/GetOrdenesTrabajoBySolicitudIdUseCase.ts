import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { OrdenTrabajoVistaCliente } from '../../domain/schemas/dto/response/work-orders.get.response';

export class GetOrdenesTrabajoBySolicitudIdUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(solicitudId: string): Promise<OrdenTrabajoVistaCliente[]> {
    const result =
      await this.processWorkOrderRepository.getOrdenesTrabajoBySolicitudId(
        solicitudId
      );
    return result;
  }
}
