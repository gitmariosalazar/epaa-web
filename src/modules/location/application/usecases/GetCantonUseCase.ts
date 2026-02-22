import type { Canton } from '../../domain/models/Canton';
import type { CantonRepository } from '../../domain/repositories/usecases/CantonRepository';

export class GetCantonUseCase {
  private readonly cantonRepository: CantonRepository;

  constructor(cantonRepository: CantonRepository) {
    this.cantonRepository = cantonRepository;
  }

  async getAllCantons(): Promise<Canton[]> {
    try {
      const cantons = await this.cantonRepository.getAllCantons();
      return cantons;
    } catch (error) {
      console.error('Error fetching cantons:', error);
      throw error;
    }
  }

  async getCantonById(id: string): Promise<Canton | null> {
    try {
      const canton = await this.cantonRepository.getCantonById(id);
      return canton;
    } catch (error) {
      console.error('Error fetching canton by ID:', error);
      throw error;
    }
  }

  async getCantonByName(name: string): Promise<Canton | null> {
    try {
      const canton = await this.cantonRepository.getCantonByName(name);
      return canton;
    } catch (error) {
      console.error('Error fetching canton by name:', error);
      throw error;
    }
  }

  async getCantonsByProvinceId(provinceId: string): Promise<Canton[]> {
    try {
      const cantons =
        await this.cantonRepository.getCantonsByProvinceId(provinceId);
      return cantons;
    } catch (error) {
      console.error('Error fetching cantons by province ID:', error);
      throw error;
    }
  }
}
