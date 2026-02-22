import type { Province } from '../../domain/models/Province';
import type { ProvinceRepository } from '../../domain/repositories/usecases/ProvinceRepository';

export class GetProvincesUseCase {
  private readonly provinceRepository: ProvinceRepository;

  constructor(provinceRepository: ProvinceRepository) {
    this.provinceRepository = provinceRepository;
  }

  async getAllProvinces(): Promise<Province[]> {
    try {
      const provinces = await this.provinceRepository.getAllProvinces();
      return provinces;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  }

  async getProvinceById(id: string): Promise<Province | null> {
    try {
      const province = await this.provinceRepository.getProvinceById(id);
      return province;
    } catch (error) {
      console.error('Error fetching province by ID:', error);
      throw error;
    }
  }

  async getProvinceByName(name: string): Promise<Province | null> {
    try {
      const province = await this.provinceRepository.getProvinceByName(name);
      return province;
    } catch (error) {
      console.error('Error fetching province by name:', error);
      throw error;
    }
  }

  async getProvincesByCountryId(countryId: string): Promise<Province[]> {
    try {
      const provinces =
        await this.provinceRepository.getProvincesByCountryId(countryId);
      return provinces;
    } catch (error) {
      console.error('Error fetching provinces by country ID:', error);
      throw error;
    }
  }
}
