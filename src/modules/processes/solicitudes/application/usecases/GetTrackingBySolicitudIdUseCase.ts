import type { TrackingSolicitudResponse } from '../../domain/models/Solicitud';
import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';
export class GetTrackingBySolicitudIdUseCase {
  private readonly solicitudRepository: SolicitudRepository;

  constructor(solicitudRepository: SolicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(
    solicitudId: string
  ): Promise<TrackingSolicitudResponse | null> {
    if (!solicitudId) {
      throw new Error('El ID de la solicitud es requerido');
    }
    const tracking =
      await this.solicitudRepository.getTrackingBySolicitudId(solicitudId);
    return tracking;
  }
}
