import type { Country } from '../../models/Country';

export interface CountryRepository {
  getAllCountries(): Promise<Country[]>;
  getCountryById(id: string): Promise<Country | null>;
  getCountryByName(name: string): Promise<Country | null>;
}
