// APPLICATION — GetTramiteByIdUseCase (SRP)
import type { TramiteRepository } from '../../domain/repositories/TramiteRepository';
import type { Tramite } from '../../domain/models/Tramite';

export class GetTramiteByIdUseCase {
  private readonly tramiteRepository: TramiteRepository;
  constructor(tramiteRepository: TramiteRepository) {
    this.tramiteRepository = tramiteRepository;
  }
  async execute(id: string): Promise<Tramite | null> {
    return this.tramiteRepository.getById(id);
  }
}
