import type { Province } from '../../models/Province';

export interface ProvinceRepository {
  getAllProvinces(): Promise<Province[]>;
  getProvinceById(id: string): Promise<Province | null>;
  getProvinceByName(name: string): Promise<Province | null>;
  getProvincesByCountryId(countryId: string): Promise<Province[]>;
}
