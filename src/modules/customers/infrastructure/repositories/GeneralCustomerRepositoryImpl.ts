import type { GeneralCustomer } from '../../domain/models/GeneralCustomer';
import type { GeneralCustomerRepository } from '../../domain/repositories/GeneralCustomerRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class GeneralCustomerRepositoryImpl implements GeneralCustomerRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getAll(limit: number, offset: number): Promise<GeneralCustomer[]> {
    const response = await this.client.get<ApiResponse<GeneralCustomer[]>>(
      '/Customers/get-general-customers',
      {
        params: { limit, offset }
      }
    );
    return response.data.data;
  }
}
