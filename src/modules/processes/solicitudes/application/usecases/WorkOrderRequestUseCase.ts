import type {
  InspectionReportResponse,
  InstallationReportResponse
} from '../../domain/dto/WorkOrderReportResponse';
import type { IWorkOrderRequestRepository } from '../../domain/repositories/WorkOrderRequestRepository';

export class WorkOrderRequestUseCase {
  private readonly repo: IWorkOrderRequestRepository;
  constructor(repo: IWorkOrderRequestRepository) {
    this.repo = repo;
  }

  getWorkOrderInspectionDetailByOrderCodeOrRequestNumber(
    orderCodeOrRequestNumber: string
  ): Promise<InspectionReportResponse | null> {
    return this.repo.getWorkOrderInspectionDetailByOrderCodeOrRequestNumber(
      orderCodeOrRequestNumber
    );
  }

  getWorkOrderInstallationDetailByOrderCodeOrRequestNumber(
    orderCodeOrRequestNumber: string
  ): Promise<InstallationReportResponse | null> {
    return this.repo.getWorkOrderInstallationDetailByOrderCodeOrRequestNumber(
      orderCodeOrRequestNumber
    );
  }
}
