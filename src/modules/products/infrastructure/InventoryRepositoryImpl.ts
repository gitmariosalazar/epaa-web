import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import type { InterfaceInventoryRepository } from '../domain/repositories/inventory.repository';
import type { InventoryResponse } from '../domain/models/products-inventory';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class InventoryRepositoryImpl implements InterfaceInventoryRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  async getInventoryById(
    inventoryId: number
  ): Promise<InventoryResponse | null> {
    try {
      const response = await this.client.get<ApiResponse<InventoryResponse>>(
        `/inventory/get-inventory/${inventoryId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('[InventoryRepository] getInventoryById failed:', error);
      return null;
    }
  }

  async getInventories(
    limit: number,
    offset: number
  ): Promise<InventoryResponse[]> {
    try {
      const response = await this.client.get<ApiResponse<InventoryResponse[]>>(
        `/inventory/get-all-inventories`,
        {
          params: { limit, offset }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('[InventoryRepository] getInventories failed:', error);
      return [];
    }
  }

  async getInventoriesByStatus(status: string): Promise<InventoryResponse[]> {
    try {
      const response = await this.client.get<ApiResponse<InventoryResponse[]>>(
        `/inventory/get-inventories-by-status/${status}`
      );
      return response.data.data;
    } catch (error) {
      console.error('[InventoryRepository] getInventoriesByStatus failed:', error);
      return [];
    }
  }

  async getInventoriesBelowMinStock(): Promise<InventoryResponse[]> {
    try {
      const response = await this.client.get<ApiResponse<InventoryResponse[]>>(
        `/inventory/get-inventories-below-min-stock`
      );
      return response.data.data;
    } catch (error) {
      console.error('[InventoryRepository] getInventoriesBelowMinStock failed:', error);
      return [];
    }
  }

  async getInventoriesByItemType(
    itemType: string
  ): Promise<InventoryResponse[]> {
    try {
      const response = await this.client.get<ApiResponse<InventoryResponse[]>>(
        `/inventory/get-inventories-by-item-type/${itemType}`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        '[InventoryRepository] getInventoriesByItemType failed:',
        error
      );
      return [];
    }
  }

  async getInventoriesByCompanyCode(
    companyCode: string
  ): Promise<InventoryResponse[]> {
    try {
      const response = await this.client.get<ApiResponse<InventoryResponse[]>>(
        `/inventory/get-inventories-by-company-code/${companyCode}`
      );
      return response.data.data;
    } catch (error) {
      console.error('[InventoryRepository] getInventoriesByCompanyCode failed:', error);
      return [];
    }
  }

  async getInventoriesByAccountCode(
    accountCode: string
  ): Promise<InventoryResponse[]> {
    try {
      const response = await this.client.get<ApiResponse<InventoryResponse[]>>(
        `/inventory/get-inventories-by-account-code/${accountCode}`
      );
      return response.data.data;
    } catch (error) {
      console.error('[InventoryRepository] getInventoriesByAccountCode failed:', error);
      return [];
    }
  }

  async getInventoriesByUnitOfMeasure(
    unitOfMeasure: string
  ): Promise<InventoryResponse[]> {
    try {
      const response = await this.client.get<ApiResponse<InventoryResponse[]>>(
        `/inventory/get-inventories-by-unit-of-measure/${unitOfMeasure}`
      );
      return response.data.data;
    } catch (error) {
      console.error('[InventoryRepository] getInventoriesByUnitOfMeasure failed:', error);
      return [];
    }
  }

  async getInventoriesLikeItemName(itemName: string): Promise<InventoryResponse[]> {
    try {
      const response = await this.client.get<ApiResponse<InventoryResponse[]>>(
        `/inventory/get-inventories-like-item-name/${itemName}`
      );
      return response.data.data;
    } catch (error) {
      console.error('[InventoryRepository] getInventoriesLikeItemName failed:', error);
      return [];
    }
  }

  async getInventoriesLikeItemCode(itemCode: string): Promise<InventoryResponse[]> {
    try {
      const response = await this.client.get<ApiResponse<InventoryResponse[]>>(
        `/inventory/get-inventories-like-item-code/${itemCode}`
      );
      return response.data.data;
    } catch (error) {
      console.error('[InventoryRepository] getInventoriesLikeItemCode failed:', error);
      return [];
    }
  }

  async findAllInventoriesPaginated(params: {
    limit: number;
    offset: number;
    query?: string;
  }): Promise<InventoryResponse[]> {
    try {
      const response = await this.client.get<ApiResponse<InventoryResponse[]>>(
        `/inventory/find-all-inventories-paginated`,
        {
          params: {
            limit: params.limit,
            offset: params.offset,
            ...(params.query ? { query: params.query } : {})
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('[InventoryRepository] findAllInventoriesPaginated failed:', error);
      return [];
    }
  }
}
