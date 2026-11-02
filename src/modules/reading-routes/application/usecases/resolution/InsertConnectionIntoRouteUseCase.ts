import type { RouteResolutionRepository } from '../../../domain/repositories/RouteResolutionRepository';
import type { InsertConnectionIntoRouteRequest } from '../../../domain/dto/request/route-requests.dto';
import type { InsertConnectionIntoRouteResponse } from '../../../domain/dto/response/route-responses.dto';

export class InsertConnectionIntoRouteUseCase {
  private readonly repository: RouteResolutionRepository;

  constructor(repository: RouteResolutionRepository) {
    this.repository = repository;
  }

  async execute(request: InsertConnectionIntoRouteRequest): Promise<InsertConnectionIntoRouteResponse> {
    return this.repository.insertConnection(request);
  }
}
