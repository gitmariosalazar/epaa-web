import type { Property } from '../../domain/models/Property';
import type { IPropertyRepository } from '../../domain/repositories/property.interface.repository';

export class FindAllPropertiesUseCase {
  private readonly propertyRepository: IPropertyRepository;

  constructor(propertyRepository: IPropertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async execute(limit: number, offset: number): Promise<Property[]> {
    return this.propertyRepository.findAllProperties(limit, offset);
  }
}
