import type { Solicitud } from '../../domain/models/Solicitud';
import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';

export class GetExpedientesByClienteUseCase {
  private readonly solicitudRepository: SolicitudRepository;

  constructor(solicitudRepository: SolicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(clienteId: string): Promise<Solicitud[]> {
    if (!clienteId) {
      throw new Error('Cliente ID is required');
    }
    const expedientes = await this.solicitudRepository.getExpedientesByCliente(clienteId);
    return expedientes;
  }
}
