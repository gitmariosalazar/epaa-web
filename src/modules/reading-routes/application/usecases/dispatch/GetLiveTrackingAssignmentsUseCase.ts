import type { RouteDispatchRepository } from '../../../domain/repositories/RouteDispatchRepository';
import type { RouteAssignment } from '../../../domain/models/RouteAssignment';

export class GetLiveTrackingAssignmentsUseCase {
  private readonly repository: RouteDispatchRepository;

  constructor(repository: RouteDispatchRepository) {
    this.repository = repository;
  }

  async execute(periodo?: string, fecha?: string): Promise<RouteAssignment[]> {
    return this.repository.getLiveTracking(periodo, fecha);
  }
}
