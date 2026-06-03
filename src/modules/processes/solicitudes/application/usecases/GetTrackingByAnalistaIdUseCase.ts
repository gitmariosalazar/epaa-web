import type { SolicitudRepository } from '@/modules/processes/solicitudes/domain/repositories/SolicitudRepository';
import type { TrackingSolicitudResponse } from '../../domain/models/Solicitud';
export class GetTrackingByAnalistaIdUseCase {
  private readonly solicitudRepository: SolicitudRepository;

  constructor(solicitudRepository: SolicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(analistaId: string): Promise<TrackingSolicitudResponse[]> {
    if (!analistaId) {
      throw new Error('El ID del analista es requerido');
    }
    const tracking =
      await this.solicitudRepository.getTrackingByAnalistaId(analistaId);
    return tracking;
  }
}
