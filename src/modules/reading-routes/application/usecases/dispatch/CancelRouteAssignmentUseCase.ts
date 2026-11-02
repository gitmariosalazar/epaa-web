import type { RouteDispatchRepository } from '../../../domain/repositories/RouteDispatchRepository';

export class CancelRouteAssignmentUseCase {
  private readonly repository: RouteDispatchRepository;

  constructor(repository: RouteDispatchRepository) {
    this.repository = repository;
  }

  async execute(idAsignacion: number, motivo?: string): Promise<{ success: boolean; message: string }> {
    return this.repository.cancelAssignment(idAsignacion, motivo);
  }
}
