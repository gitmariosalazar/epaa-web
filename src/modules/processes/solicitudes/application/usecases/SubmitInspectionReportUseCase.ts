import type { SolicitudRepository, SubmitInspectionReportDto } from '../../domain/repositories/SolicitudRepository';
export class SubmitInspectionReportUseCase {
  constructor(private readonly repo: SolicitudRepository) {}
  execute(dto: SubmitInspectionReportDto): Promise<void> { return this.repo.submitInspectionReport(dto); }
}
