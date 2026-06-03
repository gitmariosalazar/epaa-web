import type { Solicitud } from '../../domain/models/Solicitud';
import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';

export class GetExpedientsByAnalistaUseCase {
  private readonly solicitudRepository: SolicitudRepository;

  constructor(solicitudRepository: SolicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(analistaId: string): Promise<Solicitud[]> {
    if (!analistaId) {
      throw new Error('Analista ID is required');
    }
    const expedientes = await this.solicitudRepository.getExpedientesByAnalista(analistaId);
    return expedientes;
  }
}