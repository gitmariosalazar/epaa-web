import type { CustomerRepository } from '../../domain/repositories/CustomerRepository';
import type { Customer } from '../../domain/models/Customer';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class CustomerRepositoryImpl implements CustomerRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getAll(limit: number, offset: number): Promise<Customer[]> {
    const response = await this.client.get<ApiResponse<Customer[]>>(
      '/Customers/get-all-customers',
      {
        params: { limit, offset }
      }
    );
    return response.data.data;
  }

  async getById(id: string): Promise<Customer> {
    const response = await this.client.get<ApiResponse<Customer>>(
      `/Customers/get-customer-by-id/${id}`
    );
    return response.data.data;
  }

  async create(
    customer: Omit<Customer, 'customerId'> & { customerId: string }
  ): Promise<void> {
    await this.client.post<ApiResponse<void>>(
      '/Customers/create-customer',
      customer
    );
  }

  async update(id: string, customer: Partial<Customer>): Promise<void> {
    await this.client.put<ApiResponse<void>>(
      `/Customers/update-customer/${id}`,
      customer
    );
  }

  async delete(id: string): Promise<void> {
    await this.client.delete<ApiResponse<void>>(
      `/Customers/delete-customer/${id}`
    );
  }

  async findByIdentification(identification: string): Promise<Customer | null> {
    try {
      const response = await this.client.get<ApiResponse<Customer>>(
        `/Customers/get-customer-by-id/${identification}`
      );
      return response.data.data;
    } catch (error) {
      return null;
    }
  }
}
