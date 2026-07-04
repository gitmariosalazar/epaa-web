import type { InventoryResponse } from '../../domain/models/products-inventory';
import type { InterfaceInventoryRepository } from '../../domain/repositories/inventory.repository';

export class FindAllInventoriesPaginatedUseCase {
  private readonly inventoryRepository: InterfaceInventoryRepository;
  constructor(inventoryRepository: InterfaceInventoryRepository) {
    this.inventoryRepository = inventoryRepository;
  }

  async execute(params: {
    limit: number;
    offset: number;
    query?: string;
  }): Promise<InventoryResponse[]> {
    const { limit, offset, query } = params;
    return this.inventoryRepository.findAllInventoriesPaginated({
      limit,
      offset,
      query
    });
  }
}
