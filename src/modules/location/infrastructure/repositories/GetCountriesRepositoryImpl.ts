import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { Country } from '../../domain/models/Country';
import type { CountryRepository } from '../../domain/repositories/usecases/CountryRepository';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class GetCountriesRepositoryImpl implements CountryRepository {
  private readonly httpClient: HttpClientInterface;

  constructor(httpClient: HttpClientInterface) {
    this.httpClient = httpClient;
  }

  async getAllCountries(): Promise<Country[]> {
    const response = await this.httpClient.get<ApiResponse<Country[]>>(
      '/location-global/get-countries'
    );
    return response.data.data;
  }
  async getCountryById(id: string): Promise<Country | null> {
    const response = await this.httpClient.get<ApiResponse<Country>>(
      `/location-global/get-country-by-id/${id}`
    );
    return response.data.data;
  }
  async getCountryByName(name: string): Promise<Country | null> {
    const response = await this.httpClient.get<ApiResponse<Country>>(
      `/location-global/get-country-by-name/${name}`
    );
    return response.data.data;
  }
}
