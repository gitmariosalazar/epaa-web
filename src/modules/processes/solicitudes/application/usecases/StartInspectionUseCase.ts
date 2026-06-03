import type { SolicitudRepository, StartInspectionDto } from '../../domain/repositories/SolicitudRepository';

export class StartInspectionUseCase {
  private readonly repo: SolicitudRepository;
  constructor(repo: SolicitudRepository) { this.repo = repo; }
  execute(dto: StartInspectionDto): Promise<void> { return this.repo.startInspection(dto); }
}
