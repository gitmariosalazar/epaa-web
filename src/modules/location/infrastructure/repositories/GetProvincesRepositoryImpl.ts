import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { Province } from '../../domain/models/Province';
import type { ProvinceRepository } from '../../domain/repositories/usecases/ProvinceRepository';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class GetProvincesRepositoryImpl implements ProvinceRepository {
  private readonly httpClient: HttpClientInterface;

  constructor(httpClient: HttpClientInterface) {
    this.httpClient = httpClient;
  }

  async getAllProvinces(): Promise<Province[]> {
    const response = await this.httpClient.get<ApiResponse<Province[]>>(
      '/location-global/get-provinces'
    );
    return response.data.data;
  }
  async getProvinceById(id: string): Promise<Province | null> {
    const response = await this.httpClient.get<ApiResponse<Province>>(
      `/location-global/get-province-by-id/${id}`
    );
    return response.data.data;
  }
  async getProvinceByName(name: string): Promise<Province | null> {
    const response = await this.httpClient.get<ApiResponse<Province>>(
      `/location-global/get-province-by-name/${name}`
    );
    return response.data.data;
  }
  async getProvincesByCountryId(countryId: string): Promise<Province[]> {
    const response = await this.httpClient.get<ApiResponse<Province[]>>(
      `/location-global/get-provinces-by-country-id/${countryId}`
    );
    return response.data.data;
  }
}
