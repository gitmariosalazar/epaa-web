import type { RouteDispatchRepository } from '../../../domain/repositories/RouteDispatchRepository';
import type { ReassignRouteSegmentRequest } from '../../../domain/dto/request/route-requests.dto';
import type { ReassignRouteSegmentResponse } from '../../../domain/dto/response/route-responses.dto';

export class ReassignRouteSegmentUseCase {
  private readonly repository: RouteDispatchRepository;

  constructor(repository: RouteDispatchRepository) {
    this.repository = repository;
  }

  async execute(request: ReassignRouteSegmentRequest): Promise<ReassignRouteSegmentResponse> {
    return this.repository.reassignRouteSegment(request);
  }
}
