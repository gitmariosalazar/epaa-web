import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { PaymentsRepository } from '../../domain/repositories/PaymentsRepository';
import type { PaymentReading } from '../../domain/models/PaymentReading';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import type { Payment } from '../../domain/models/Payment';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';

export class PaymentsRepositoryImpl implements PaymentsRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async findAllPaymentReadingPayrollsByDate(
    paymentDate: string
  ): Promise<PaymentReading[]> {
    const response = await this.client.get<ApiResponse<PaymentReading[]>>(
      `/readings/find-payment-readings-by-payment-date/${paymentDate}`
    );
    return response.data.data;
  }

  async findAllPaymentByDateAndOrderValue(
    paymentDate: string,
    orderValue: number
  ): Promise<Payment[]> {
    const response = await this.client.get<ApiResponse<Payment[]>>(
      `/readings/find-payment-by-payment-date-and-order/${paymentDate}/${orderValue}`
    );
    return response.data.data;
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
    return response.data.data;
  }
}
