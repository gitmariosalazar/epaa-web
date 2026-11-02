import type { ReadingRouteCatalogRepository } from '../../../domain/repositories/ReadingRouteCatalogRepository';
import type { ReadingRoute } from '../../../domain/models/ReadingRoute';

export class GetRouteByIdUseCase {
  private readonly repository: ReadingRouteCatalogRepository;

  constructor(repository: ReadingRouteCatalogRepository) {
    this.repository = repository;
  }

  async execute(idRuta: number): Promise<ReadingRoute> {
    return this.repository.getRouteById(idRuta);
  }
}
