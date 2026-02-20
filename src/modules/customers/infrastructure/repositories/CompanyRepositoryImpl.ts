import type {
  CompanyRepository,
  CreateCompanyRequest
} from '../../domain/repositories/CompanyRepository';
import type { Company } from '../../domain/models/Company';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class CompanyRepositoryImpl implements CompanyRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getAll(limit: number, offset: number): Promise<Company[]> {
    const response = await this.client.get<ApiResponse<Company[]>>(
      '/Customers/get-all-companies',
      {
        params: { limit, offset }
      }
    );
    return response.data.data;
  }

  async getById(id: string): Promise<Company> {
    const response = await this.client.get<ApiResponse<Company>>(
      `/Customers/get-company/${id}`
    );
    return response.data.data;
  }

  async create(company: CreateCompanyRequest): Promise<void> {
    await this.client.post<ApiResponse<void>>(
      '/Customers/create-company',
      company
    );
  }

  async update(id: string, company: CreateCompanyRequest): Promise<void> {
    await this.client.put<ApiResponse<void>>(
      `/Customers/update-company/${id}`,
      company
    );
  }

  async delete(id: string): Promise<void> {
    await this.client.delete<ApiResponse<void>>(
      `/Customers/delete-company/${id}`
    );
  }
}
