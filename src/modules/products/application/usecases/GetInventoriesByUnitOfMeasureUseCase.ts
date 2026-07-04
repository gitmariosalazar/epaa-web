import type { InventoryResponse } from '../../domain/models/products-inventory';
import type { InterfaceInventoryRepository } from '../../domain/repositories/inventory.repository';

export class GetInventoriesByUnitOfMeasureUseCase {
  private readonly inventoryRepository: InterfaceInventoryRepository;
  constructor(inventoryRepository: InterfaceInventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  async execute(unitOfMeasure: string): Promise<InventoryResponse[]> {
    return this.inventoryRepository.getInventoriesByUnitOfMeasure(
      unitOfMeasure
    );
  }
}
