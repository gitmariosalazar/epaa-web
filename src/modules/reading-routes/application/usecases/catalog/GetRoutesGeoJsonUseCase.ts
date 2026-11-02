import type { ReadingRouteCatalogRepository } from '../../../domain/repositories/ReadingRouteCatalogRepository';
import type { RouteGeoJsonFeatureCollection } from '../../../domain/models/ReadingRoute';

export class GetRoutesGeoJsonUseCase {
  private readonly repository: ReadingRouteCatalogRepository;

  constructor(repository: ReadingRouteCatalogRepository) {
    this.repository = repository;
  }

  async execute(sector?: number, activa?: boolean): Promise<RouteGeoJsonFeatureCollection> {
    return this.repository.getRoutesGeoJson(sector, activa);
  }
}
