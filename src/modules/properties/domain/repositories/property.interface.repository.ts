import type { Property } from '../models/Property';

export interface IPropertyRepository {
  getPropertyById(propertyCadastralKey: string): Promise<Property | null>;
  verifyPropertyExists(propertyCadastralKey: string): Promise<boolean>;
  findAllProperties(limit: number, offset: number): Promise<Property[]>;
  findPropertiesByOwner(
    clientId: string,
    limit: number,
    offset: number
  ): Promise<Property[]>;
}
