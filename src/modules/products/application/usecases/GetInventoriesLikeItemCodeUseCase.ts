import type { InventoryResponse } from '../../domain/models/products-inventory';
import type { InterfaceInventoryRepository } from '../../domain/repositories/inventory.repository';

export class GetInventoriesLikeItemCodeUseCase {
  private readonly inventoryRepository: InterfaceInventoryRepository;
  constructor(inventoryRepository: InterfaceInventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  async execute(itemCode: string): Promise<InventoryResponse[]> {
    return this.inventoryRepository.getInventoriesLikeItemCode(itemCode);
  }
}
