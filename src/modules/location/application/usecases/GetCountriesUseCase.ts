import type { Country } from '../../domain/models/Country';
import type { CountryRepository } from '../../domain/repositories/usecases/CountryRepository';

export class GetCountriesUseCase {
  private readonly countryRepository: CountryRepository;

  constructor(countryRepository: CountryRepository) {
    this.countryRepository = countryRepository;
  }

  async getAllCountries(): Promise<Country[]> {
    try {
      const countries = await this.countryRepository.getAllCountries();
      return countries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }

  async getCountryById(id: string): Promise<Country | null> {
    try {
      const country = await this.countryRepository.getCountryById(id);
      return country;
    } catch (error) {
      console.error('Error fetching country by ID:', error);
      throw error;
    }
  }

  async getCountryByName(name: string): Promise<Country | null> {
    try {
      const country = await this.countryRepository.getCountryByName(name);
      return country;
    } catch (error) {
      console.error('Error fetching country by name:', error);
      throw error;
    }
  }
}
