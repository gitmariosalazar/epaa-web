import type { ReadingRouteCatalogRepository } from '../../../domain/repositories/ReadingRouteCatalogRepository';
import type { RouteConnection } from '../../../domain/models/RouteConnection';

export class GetRouteConnectionsUseCase {
  private readonly repository: ReadingRouteCatalogRepository;

  constructor(repository: ReadingRouteCatalogRepository) {
    this.repository = repository;
  }

  async execute(idRuta: number): Promise<RouteConnection[]> {
    return this.repository.getRouteConnections(idRuta);
  }
}
