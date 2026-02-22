import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { Canton } from '../../domain/models/Canton';
import type { CantonRepository } from '../../domain/repositories/usecases/CantonRepository';

export class GetCantonRepositoryImpl implements CantonRepository {
  private readonly httpClient: HttpClientInterface;

  constructor(httpClient: HttpClientInterface) {
    this.httpClient = httpClient;
  }

  async getAllCantons(): Promise<Canton[]> {
    const response = await this.httpClient.get<Canton[]>(
      '/location-global/get-cantons'
    );
    return response.data;
  }
  async getCantonById(id: string): Promise<Canton | null> {
    const response = await this.httpClient.get<Canton>(
      `/location-global/get-canton-by-id/${id}`
    );
    return response.data;
  }
  async getCantonByName(name: string): Promise<Canton | null> {
    const response = await this.httpClient.get<Canton>(
      `/location-global/get-canton-by-name/${name}`
    );
    return response.data;
  }
  async getCantonsByProvinceId(provinceId: string): Promise<Canton[]> {
    const response = await this.httpClient.get<Canton[]>(
      `/location-global/get-cantons-by-province-id/${provinceId}`
    );
    return response.data;
  }
}
