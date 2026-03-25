import type { Property } from '../../domain/models/Property';
import type { IPropertyRepository } from '../../domain/repositories/property.interface.repository';

export class GetPropertyByIdUseCase {
  private readonly propertyRepository: IPropertyRepository;

  constructor(propertyRepository: IPropertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  async execute(propertyCadastralKey: string): Promise<Property | null> {
    return this.propertyRepository.getPropertyById(propertyCadastralKey);
  }
}
