import type { RouteDispatchRepository } from '../../../domain/repositories/RouteDispatchRepository';

export class ResumeRouteAssignmentUseCase {
  private readonly repository: RouteDispatchRepository;

  constructor(repository: RouteDispatchRepository) {
    this.repository = repository;
  }

  async execute(
    idAsignacion: number,
    motivo?: string,
  ): Promise<{ success: boolean; message: string; nuevoEstado?: string }> {
    return this.repository.resumeAssignment(idAsignacion, motivo);
  }
}
