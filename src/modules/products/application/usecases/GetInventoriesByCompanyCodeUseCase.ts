import type { InventoryResponse } from '../../domain/models/products-inventory';
import type { InterfaceInventoryRepository } from '../../domain/repositories/inventory.repository';

export class GetInventoriesByCompanyCodeUseCase {
  private readonly inventoryRepository: InterfaceInventoryRepository;
  constructor(inventoryRepository: InterfaceInventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  async execute(companyCode: string): Promise<InventoryResponse[]> {
    return this.inventoryRepository.getInventoriesByCompanyCode(companyCode);
  }
}
