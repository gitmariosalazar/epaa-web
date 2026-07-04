import type { InventoryResponse } from '../../domain/models/products-inventory';
import type { InterfaceInventoryRepository } from '../../domain/repositories/inventory.repository';

export class GetInventoriesLikeItemNameUseCase {
  private readonly inventoryRepository: InterfaceInventoryRepository;
  constructor(inventoryRepository: InterfaceInventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  async execute(itemName: string): Promise<InventoryResponse[]> {
    return this.inventoryRepository.getInventoriesLikeItemName(itemName);
  }
}
