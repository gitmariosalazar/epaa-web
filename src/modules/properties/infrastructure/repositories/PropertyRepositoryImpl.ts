import type { IPropertyRepository } from '../../domain/repositories/property.interface.repository';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import type { Property, PropertyByType } from '../../domain/models/Property';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';

export class PropertyRepositoryImpl implements IPropertyRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getPropertyById(
    propertyCadastralKey: string
  ): Promise<Property | null> {
    const response = await this.client.get<ApiResponse<Property>>(
      `/properties/get-property/${propertyCadastralKey}`
    );
    return response.data.data;
  }

  async verifyPropertyExists(propertyCadastralKey: string): Promise<boolean> {
    const response = await this.client.get<ApiResponse<boolean>>(
      `/properties/verify-property-exists/${propertyCadastralKey}`
    );
    return response.data.data;
  }

  async findAllProperties(limit: number, offset: number): Promise<Property[]> {
    const response = await this.client.get<ApiResponse<Property[]>>(
      `/properties/get-all-properties?limit=${limit}&offset=${offset}`
    );
    return response.data.data;
  }

  async findPropertiesByOwner(
    clientId: string,
    limit: number,
    offset: number
  ): Promise<Property[]> {
    const response = await this.client.get<ApiResponse<Property[]>>(
      `/properties/get-properties-by-owner/${clientId}?limit=${limit}&offset=${offset}`
    );
    return response.data.data;
  }

  async findPropertiesByType(): Promise<PropertyByType[]> {
    const response = await this.client.get<ApiResponse<PropertyByType[]>>(
      `/properties/get-properties-by-type`
    );
    return response.data.data;
  }
}
