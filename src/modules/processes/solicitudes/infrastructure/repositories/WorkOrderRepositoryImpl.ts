import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type {
  InstallationReportResponse,
  InspectionReportResponse
} from '../../domain/dto/WorkOrderReportResponse';
import type { IWorkOrderRequestRepository } from '../../domain/repositories/WorkOrderRequestRepository';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';

export class WorkOrderRepositoryImpl implements IWorkOrderRequestRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }
  async getWorkOrderInspectionDetailByOrderCodeOrRequestNumber(
    orderCodeOrRequestNumber: string
  ): Promise<InspectionReportResponse | null> {
    try {
      const response = await this.client.get<
        ApiResponse<InspectionReportResponse>
      >(`/inspection-report/ordenes/${orderCodeOrRequestNumber}/informe`);
      return response.data?.data || null;
    } catch (err: any) {
      if (isNotFoundError(err)) return null;
      throw err;
    }
  }

  async getWorkOrderInstallationDetailByOrderCodeOrRequestNumber(
    orderCodeOrRequestNumber: string
  ): Promise<InstallationReportResponse | null> {
    try {
      const response = await this.client.get<
        ApiResponse<InstallationReportResponse>
      >(`/installation-report/ordenes/${orderCodeOrRequestNumber}/informe`);
      return response.data?.data || null;
    } catch (err: any) {
      if (isNotFoundError(err)) return null;
      throw err;
    }
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────────
const isNotFoundError = (err: any): boolean => {
  const msg = (err?.message ?? '').toLowerCase();
  return (
    msg.includes('no encontrado') ||
    msg.includes('not found') ||
    msg.includes('404')
  );
};
