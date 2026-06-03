import type { SolicitudRepository, ApproveInspectionReportDto } from '../../domain/repositories/SolicitudRepository';
export class ApproveInspectionReportUseCase {
  constructor(private readonly repo: SolicitudRepository) {}
  execute(dto: ApproveInspectionReportDto): Promise<void> { return this.repo.approveInspectionReport(dto); }
}
