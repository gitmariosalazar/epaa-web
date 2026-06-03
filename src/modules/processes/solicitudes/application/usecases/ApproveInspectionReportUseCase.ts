import type { SolicitudRepository, ApproveInspectionReportDto } from '../../domain/repositories/SolicitudRepository';

export class ApproveInspectionReportUseCase {
  private readonly repo: SolicitudRepository;
  constructor(repo: SolicitudRepository) { this.repo = repo; }
  execute(dto: ApproveInspectionReportDto): Promise<void> { return this.repo.approveInspectionReport(dto); }
}
