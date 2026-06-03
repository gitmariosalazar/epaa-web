// APPLICATION — GetMisSolicitudesUseCase (SRP)
import type { TramiteRepository } from '../../domain/repositories/TramiteRepository';
import type { SolicitudTramite } from '../../domain/models/Tramite';

export class GetMisSolicitudesUseCase {
  private readonly tramiteRepository: TramiteRepository;
  constructor(tramiteRepository: TramiteRepository) {
    this.tramiteRepository = tramiteRepository;
  }
  async execute(): Promise<SolicitudTramite[]> {
    return this.tramiteRepository.getMisSolicitudes();
  }
}
