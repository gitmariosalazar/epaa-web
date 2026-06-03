// APPLICATION — GetAllTramitesUseCase (SRP)
import type { TramiteRepository } from '../../domain/repositories/TramiteRepository';
import type { Tramite } from '../../domain/models/Tramite';

export class GetAllTramitesUseCase {
  private readonly tramiteRepository: TramiteRepository;
  constructor(tramiteRepository: TramiteRepository) {
    this.tramiteRepository = tramiteRepository;
  }
  async execute(): Promise<Tramite[]> {
    return this.tramiteRepository.getAll();
  }
}
