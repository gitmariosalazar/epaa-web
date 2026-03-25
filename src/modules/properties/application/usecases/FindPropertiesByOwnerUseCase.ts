import type { Property } from '../../domain/models/Property';
import type { IPropertyRepository } from '../../domain/repositories/property.interface.repository';

export class FindPropertiesByOwnerUseCase {
  private readonly propertyRepository: IPropertyRepository;

  constructor(propertyRepository: IPropertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async execute(
    clientId: string,
    limit: number,
    offset: number
  ): Promise<Property[]> {
    return this.propertyRepository.findPropertiesByOwner(
      clientId,
      limit,
      offset
    );
  }
}
