import type { RequestDetailByClientResponse } from '../../domain/models/Solicitud';
import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';

export class GetRequestDetailByRequestIdOrNumberUseCase {
  private readonly solicitudRepository: SolicitudRepository;

  constructor(solicitudRepository: SolicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(
    requestNumberOrId: string
  ): Promise<RequestDetailByClientResponse | null> {
    if (!requestNumberOrId) {
      throw new Error('El número o ID de la solicitud es requerido');
    }
    const solicitud =
      await this.solicitudRepository.getRequestDetailByRequestIdOrNumber(
        requestNumberOrId
      );
    return solicitud;
  }
}
