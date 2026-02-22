import type { Parish } from '../../domain/models/Parish';
import type { ParishRepository } from '../../domain/repositories/usecases/ParishRepository';

export class GetParishUseCase {
  private readonly parishRepository: ParishRepository;

  constructor(parishRepository: ParishRepository) {
    this.parishRepository = parishRepository;
  }

  async getAllParishes(): Promise<Parish[]> {
    try {
      const parishes = await this.parishRepository.getAllParishes();
      return parishes;
    } catch (error) {
      console.error('Error fetching parishes:', error);
      throw error;
    }
  }

  async getParishById(id: string): Promise<Parish | null> {
    try {
      const parish = await this.parishRepository.getParishById(id);
      return parish;
    } catch (error) {
      console.error('Error fetching parish by ID:', error);
      throw error;
    }
  }

  async getParishByName(name: string): Promise<Parish | null> {
    try {
      const parish = await this.parishRepository.getParishByName(name);
      return parish;
    } catch (error) {
      console.error('Error fetching parish by name:', error);
      throw error;
    }
  }

  async getParishesByCantonId(cantonId: string): Promise<Parish[]> {
    try {
      const parishes =
        await this.parishRepository.getParishesByCantonId(cantonId);
      return parishes;
    } catch (error) {
      console.error('Error fetching parishes by canton ID:', error);
      throw error;
    }
  }
}
