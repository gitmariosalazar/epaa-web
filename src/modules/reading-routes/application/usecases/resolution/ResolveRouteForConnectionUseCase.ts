import type { RouteResolutionRepository } from '../../../domain/repositories/RouteResolutionRepository';
import type { RouteResolution } from '../../../domain/models/RouteResolution';

export class ResolveRouteForConnectionUseCase {
  private readonly repository: RouteResolutionRepository;

  constructor(repository: RouteResolutionRepository) {
    this.repository = repository;
  }

  async execute(
    latitud: number,
    longitud: number,
    sector?: number,
    acometidaId?: string,
  ): Promise<RouteResolution> {
    return this.repository.resolveRoute({ latitud, longitud, sector, acometidaId });
  }
}
