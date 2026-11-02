import type { ReadingRouteCatalogRepository } from '../../../domain/repositories/ReadingRouteCatalogRepository';
import type { RouteCentroidFeatureCollection } from '../../../domain/models/ReadingRoute';

export class GetRouteCentroidsUseCase {
  private readonly repository: ReadingRouteCatalogRepository;

  constructor(repository: ReadingRouteCatalogRepository) {
    this.repository = repository;
  }

  async execute(activa?: boolean): Promise<RouteCentroidFeatureCollection> {
    return this.repository.getRouteCentroids(activa);
  }
}
