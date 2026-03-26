import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { PaymentsRepository } from '../../domain/repositories/PaymentsRepository';
import type { PaymentReading } from '../../domain/models/PaymentReading';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import type { Payment } from '../../domain/models/Payment';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { OverduePayment } from '../../domain/models/OverdueReading';
import type { PendingReading } from '../../domain/models/PendingReading';

export class PaymentsRepositoryImpl implements PaymentsRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  private handleResponse<T>(response: ApiResponse<T>): T {
    // Some endpoints return { data: { data: [...] } } while others return { data: [...] }
    // This depends on how the backend wraps the response and how the HttpClient handles it.
    const result = response.data;
    if (result && typeof result === 'object' && 'data' in result) {
      return (result as any).data;
    }
    return result as T;
  }

  async findAllPaymentReadingPayrollsByDate(
    paymentDate: string
  ): Promise<PaymentReading[]> {
    const response = await this.client.get<ApiResponse<PaymentReading[]>>(
      `/readings/find-payment-readings-by-payment-date/${paymentDate}`
    );
    return this.handleResponse(response.data);
  }

  async findAllPaymentByDateAndOrderValue(
    paymentDate: string,
    orderValue: number
  ): Promise<Payment[]> {
    const response = await this.client.get<ApiResponse<Payment[]>>(
      `/readings/find-payment-by-payment-date-and-order/${paymentDate}/${orderValue}`
    );
    return this.handleResponse(response.data);
  }

  async findAllPaymentsByDateRange(
    initDate: string,
    endDate: string,
    limit: number,
    offset: number
  ): Promise<Payment[]> {
    const response = await this.client.get<ApiResponse<Payment[]>>(
      `/readings/find-payment-by-init-date-and-end-date/${initDate}/${endDate}/${limit}/${offset}`
    );
    return this.handleResponse(response.data);
  }

  async findAllOverduePayments(
    limit?: number,
    offset?: number
  ): Promise<OverduePayment[]> {
    const response = await this.client.get<ApiResponse<OverduePayment[]>>(
      `/readings/find-all-overdue-payments/${limit}/${offset}`
    );
    return this.handleResponse(response.data);
  }

  async findPendingReadingsByCadastralKeyOrCardId(
    searchValue: string
  ): Promise<PendingReading[]> {
    const response = await this.client.get<ApiResponse<PendingReading[]>>(
      `/readings/find-pending-reading-by-cadastral-key-or-card-id-all/${searchValue}`
    );
    return this.handleResponse(response.data);
  }
}
