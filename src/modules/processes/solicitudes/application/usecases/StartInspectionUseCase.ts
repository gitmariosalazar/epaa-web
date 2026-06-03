import type { SolicitudRepository, StartInspectionDto } from '../../domain/repositories/SolicitudRepository';
export class StartInspectionUseCase {
  constructor(private readonly repo: SolicitudRepository) {}
  execute(dto: StartInspectionDto): Promise<void> { return this.repo.startInspection(dto); }
}
