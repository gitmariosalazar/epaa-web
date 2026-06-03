import type { SolicitudRepository, SubmitInspectionReportDto } from '../../domain/repositories/SolicitudRepository';

export class SubmitInspectionReportUseCase {
  private readonly repo: SolicitudRepository;
  constructor(repo: SolicitudRepository) { this.repo = repo; }
  execute(dto: SubmitInspectionReportDto): Promise<void> { return this.repo.submitInspectionReport(dto); }
}
