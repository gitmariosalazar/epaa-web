import type { RouteDispatchRepository } from '../../../domain/repositories/RouteDispatchRepository';
import type { AssignSingleRouteRequest } from '../../../domain/dto/request/route-requests.dto';

export class AssignSingleRouteUseCase {
  private readonly repository: RouteDispatchRepository;

  constructor(repository: RouteDispatchRepository) {
    this.repository = repository;
  }

  async execute(request: AssignSingleRouteRequest): Promise<{ idAsignacion: number; message: string }> {
    return this.repository.assignSingleRoute(request);
  }
}
