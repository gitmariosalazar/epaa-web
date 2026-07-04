import type { InventoryResponse } from '../../domain/models/products-inventory';
import type { InterfaceInventoryRepository } from '../../domain/repositories/inventory.repository';

export class GetInventoriesUseCase {
  private readonly inventoryRepository: InterfaceInventoryRepository;
  constructor(inventoryRepository: InterfaceInventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  async execute(limit: number, offset: number): Promise<InventoryResponse[]> {
    return this.inventoryRepository.getInventories(limit, offset);
  }
}
