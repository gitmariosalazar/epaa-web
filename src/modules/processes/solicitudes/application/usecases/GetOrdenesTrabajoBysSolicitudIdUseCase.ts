import type { SolicitudOrdenTrabajoResponse } from '../../domain/models/Solicitud';
import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';

export class GetOrdenesTrabajoBysSolicitudIdUseCase {
  private readonly solicitudRepository: SolicitudRepository;

  constructor(solicitudRepository: SolicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(solicitudId: string): Promise<SolicitudOrdenTrabajoResponse[]> {
    if (!solicitudId) {
      throw new Error('Solicitud ID is required');
    }
    const tracking =
      await this.solicitudRepository.getOrdenesTrabajoBysSolicitudId(
        solicitudId
      );
    return tracking;
  }
}
