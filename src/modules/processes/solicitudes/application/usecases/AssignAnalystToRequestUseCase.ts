import type { SolicitudRepository } from '../../domain/repositories/SolicitudRepository';

export class AssignAnalystToRequestUseCase {
  private readonly repo: SolicitudRepository;
  constructor(repo: SolicitudRepository) {
    this.repo = repo;
  }
  execute(solicitudId: string, analystId: string): Promise<boolean> {
    return this.repo.assignAnalystToRequest(solicitudId, analystId);
  }
}
