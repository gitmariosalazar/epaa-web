import type { Parish } from '../../models/Parish';

export interface ParishRepository {
  getAllParishes(): Promise<Parish[]>;
  getParishById(id: string): Promise<Parish | null>;
  getParishByName(name: string): Promise<Parish | null>;
  getParishesByCantonId(cantonId: string): Promise<Parish[]>;
}
