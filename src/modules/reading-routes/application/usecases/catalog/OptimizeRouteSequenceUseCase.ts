import type { ReadingRouteCatalogRepository } from '../../../domain/repositories/ReadingRouteCatalogRepository';
import type { OptimizeRouteSequenceRequest } from '../../../domain/dto/request/route-requests.dto';
import type { OptimizeSequenceResponse } from '../../../domain/dto/response/route-responses.dto';

export class OptimizeRouteSequenceUseCase {
  private readonly repository: ReadingRouteCatalogRepository;

  constructor(repository: ReadingRouteCatalogRepository) {
    this.repository = repository;
  }

  async execute(idRuta: number, request?: OptimizeRouteSequenceRequest): Promise<OptimizeSequenceResponse> {
    return this.repository.optimizeRouteSequence(idRuta, request);
  }
}
