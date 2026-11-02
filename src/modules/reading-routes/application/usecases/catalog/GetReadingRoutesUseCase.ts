import type { ReadingRouteCatalogRepository } from '../../../domain/repositories/ReadingRouteCatalogRepository';
import type { FindReadingRoutesQuery } from '../../../domain/dto/request/route-requests.dto';
import type { PaginatedRoutesResponse } from '../../../domain/dto/response/route-responses.dto';

export class GetReadingRoutesUseCase {
  private readonly repository: ReadingRouteCatalogRepository;

  constructor(repository: ReadingRouteCatalogRepository) {
    this.repository = repository;
  }

  async execute(query?: FindReadingRoutesQuery): Promise<PaginatedRoutesResponse> {
    return this.repository.getRoutes(query);
  }
}
