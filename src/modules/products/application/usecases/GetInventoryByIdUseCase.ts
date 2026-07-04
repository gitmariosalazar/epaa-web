import type { InventoryResponse } from '../../domain/models/products-inventory';
import type { InterfaceInventoryRepository } from '../../domain/repositories/inventory.repository';

export class GetInventoryByIdUseCase {
  private readonly inventoryRepository: InterfaceInventoryRepository;
  constructor(inventoryRepository: InterfaceInventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  async execute(inventoryId: number): Promise<InventoryResponse | null> {
    return this.inventoryRepository.getInventoryById(inventoryId);
  }
}
