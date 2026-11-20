import type { ReadingRouteCatalogRepository } from '../../../domain/repositories/ReadingRouteCatalogRepository';
import type { RouteCentroidFeatureCollection } from '../../../domain/models/ReadingRoute';

export class GetRouteCentroidsUseCase {
  private readonly repository: ReadingRouteCatalogRepository;

  constructor(repository: ReadingRouteCatalogRepository) {
    this.repository = repository;
  }

  async execute(
    filter?:
      | boolean
      | {
          sectorId?: number;
          activa?: boolean;
          estado?: string;
          periodo?: string;
        },
  ): Promise<RouteCentroidFeatureCollection> {
    return this.repository.getRouteCentroids(filter);
  }
}
