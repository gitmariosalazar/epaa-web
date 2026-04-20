import type { AgreementsRepository } from '@/modules/accounting/domain/repositories/AgreementsRepository';
import type { DateRangeParams } from '../../domain/dto/params/DataEntryParams';
import type {
  AgreementInstallmentResponse,
  AgreementKPIsCustomerResponse,
  AgreementKPIsResponse,
  CitizenSummary,
  CollectorPerformance,
  Debtor,
  MonthlyCollectionSummary,
  PaymentMethodSummary
} from '../../domain/models/Agreements';
import type { AgreementsParams } from '../../domain/dto/params/AgreementsParams';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class AgreementsRepositoryImpl implements AgreementsRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  private handleResponse<T>(data: any): T {
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data;
    }
    return data as T;
  }

  async getAgreementInstallmentDetails(
    cardId: string,
    params: DateRangeParams
  ): Promise<AgreementInstallmentResponse[]> {
    const response = await this.client.get<
      ApiResponse<AgreementInstallmentResponse[]>
    >(`/accounting/get-agreement-installment-details/${cardId}`, { params });
    return this.handleResponse(response.data);
  }

  async getAgreementsKpi(
    params: AgreementsParams
  ): Promise<AgreementKPIsResponse[]> {
    const response = await this.client.get<
      ApiResponse<AgreementKPIsResponse[]>
    >(`/accounting/get-agreements-kpi`, { params });
    return this.handleResponse(response.data);
  }

  async getAgreementsKpiCustomer(
    cardId: string,
    params: AgreementsParams
  ): Promise<AgreementKPIsCustomerResponse[]> {
    const response = await this.client.get<
      ApiResponse<AgreementKPIsCustomerResponse[]>
    >(`/accounting/get-agreements-kpi-customer/${cardId}`, { params });
    return this.handleResponse(response.data);
  }

  async getMonthlyCollectionSummary(
    monthsBack: number
  ): Promise<MonthlyCollectionSummary[]> {
    const response = await this.client.get<
      ApiResponse<MonthlyCollectionSummary[]>
    >(`/accounting/get-monthly-collection-summary`, { params: { monthsBack } });
    return this.handleResponse(response.data);
  }

  async getDebtorsWithRisk(): Promise<Debtor[]> {
    const response = await this.client.get<ApiResponse<Debtor[]>>(
      `/accounting/get-debtors-with-risk`
    );
    return this.handleResponse(response.data);
  }

  async getCollectorPerformance(
    params: DateRangeParams
  ): Promise<CollectorPerformance[]> {
    const response = await this.client.get<ApiResponse<CollectorPerformance[]>>(
      `/accounting/get-collector-performance`,
      { params }
    );
    return this.handleResponse(response.data);
  }

  async getPaymentMethodSummary(
    params: DateRangeParams
  ): Promise<PaymentMethodSummary[]> {
    const response = await this.client.get<ApiResponse<PaymentMethodSummary[]>>(
      `/accounting/get-payment-method-summary`,
      { params }
    );
    return this.handleResponse(response.data);
  }

  async getCitizenSummary(params: DateRangeParams): Promise<CitizenSummary[]> {
    const response = await this.client.get<ApiResponse<CitizenSummary[]>>(
      `/accounting/get-citizen-summary`,
      { params }
    );
    return this.handleResponse(response.data);
  }
}
