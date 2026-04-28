import type { IPropertyRepository } from '../../domain/repositories/property.interface.repository';
import type { PropertyByType } from '../../domain/models/Property';

export class FindPropertiesByTypeUseCase {
  private readonly propertyRepository: IPropertyRepository;

  constructor(propertyRepository: IPropertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async execute(): Promise<PropertyByType[]> {
    return await this.propertyRepository.findPropertiesByType();
  }
}
