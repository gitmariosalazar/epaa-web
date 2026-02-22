import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { Parish } from '../../domain/models/Parish';
import type { ParishRepository } from '../../domain/repositories/usecases/ParishRepository';

export class GetParishRepositoryImpl implements ParishRepository {
  private readonly httpClient: HttpClientInterface;

  constructor(httpClient: HttpClientInterface) {
    this.httpClient = httpClient;
  }

  async getAllParishes(): Promise<Parish[]> {
    const response = await this.httpClient.get<Parish[]>(
      '/location-global/get-parishes'
    );
    return response.data;
  }
  async getParishById(id: string): Promise<Parish | null> {
    const response = await this.httpClient.get<Parish>(
      `/location-global/get-parish-by-id/${id}`
    );
    return response.data;
  }
  async getParishByName(name: string): Promise<Parish | null> {
    const response = await this.httpClient.get<Parish>(
      `/location-global/get-parish-by-name/${name}`
    );
    return response.data;
  }
  async getParishesByCantonId(cantonId: string): Promise<Parish[]> {
    const response = await this.httpClient.get<Parish[]>(
      `/location-global/get-parishes-by-canton-id/${cantonId}`
    );
    return response.data;
  }
}
