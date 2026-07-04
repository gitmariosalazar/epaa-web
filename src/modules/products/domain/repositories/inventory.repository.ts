import type { InventoryResponse } from '../models/products-inventory';

export interface InterfaceInventoryRepository {
  // Define repository methods here
  getInventoryById(inventoryId: number): Promise<InventoryResponse | null>;
  getInventories(limit: number, offset: number): Promise<InventoryResponse[]>;
  getInventoriesByStatus(status: string): Promise<InventoryResponse[]>;
  getInventoriesBelowMinStock(): Promise<InventoryResponse[]>;
  getInventoriesByItemType(itemType: string): Promise<InventoryResponse[]>;
  getInventoriesByCompanyCode(
    companyCode: string
  ): Promise<InventoryResponse[]>;
  getInventoriesByAccountCode(
    accountCode: string
  ): Promise<InventoryResponse[]>;
  getInventoriesByUnitOfMeasure(
    unitOfMeasure: string
  ): Promise<InventoryResponse[]>;
  getInventoriesLikeItemName(itemName: string): Promise<InventoryResponse[]>;
  getInventoriesLikeItemCode(itemCode: string): Promise<InventoryResponse[]>;

  findAllInventoriesPaginated(params: {
    limit: number;
    offset: number;
    query?: string;
  }): Promise<InventoryResponse[]>;
}
/*
Nombres de clase para Implementacion
InventoryRepositoryImpl.ts

 */
