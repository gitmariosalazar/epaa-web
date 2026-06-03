import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';
import type { TrackingSolicitudResponse } from '../../domain/models/Solicitud';

export class GetTrackingByClienteIdUseCase {
  private readonly solicitudRepository: SolicitudRepository;

  constructor(solicitudRepository: SolicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(clienteId: string): Promise<TrackingSolicitudResponse[]> {
    if (!clienteId) {
      throw new Error('Cliente ID no proporcionado');
    }
    return this.solicitudRepository.getTrackingByClienteId(clienteId);
  }
}