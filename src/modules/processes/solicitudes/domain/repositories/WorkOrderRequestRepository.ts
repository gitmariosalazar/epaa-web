import type {
  InstallationReportResponse,
  InspectionReportResponse
} from '../dto/WorkOrderReportResponse';

export interface IWorkOrderRequestRepository {
  getWorkOrderInspectionDetailByOrderCodeOrRequestNumber(
    orderCodeOrRequestNumber: string
  ): Promise<InspectionReportResponse | null>;

  getWorkOrderInstallationDetailByOrderCodeOrRequestNumber(
    orderCodeOrRequestNumber: string
  ): Promise<InstallationReportResponse | null>;
}
