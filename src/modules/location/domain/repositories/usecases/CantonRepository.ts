import type { Canton } from '../../models/Canton';

export interface CantonRepository {
  getAllCantons(): Promise<Canton[]>;
  getCantonById(id: string): Promise<Canton | null>;
  getCantonByName(name: string): Promise<Canton | null>;
  getCantonsByProvinceId(provinceId: string): Promise<Canton[]>;
}
