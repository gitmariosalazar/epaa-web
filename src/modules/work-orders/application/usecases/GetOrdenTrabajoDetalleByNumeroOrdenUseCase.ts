import type { ProcessWorkOrderRepository } from '../../domain/repositories/process-work-order.interface.repository';
import type { OrdenTrabajoDetalle } from '../../domain/schemas/dto/response/work-orders.get.response';

export class GetOrdenTrabajoDetalleByNumeroOrdenUseCase {
  private readonly processWorkOrderRepository: ProcessWorkOrderRepository;

  constructor(processWorkOrderRepository: ProcessWorkOrderRepository) {
    this.processWorkOrderRepository = processWorkOrderRepository;
  }

  async execute(numeroOrden: string): Promise<OrdenTrabajoDetalle | null> {
    const result =
      await this.processWorkOrderRepository.getOrdenTrabajoDetalleByNumeroOrden(
        numeroOrden
      );
    return result;
  }
}
