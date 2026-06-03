import type { BeneficioTerceraEdad } from '../models/BeneficioTerceraEdad';
export interface BeneficioTerceraEdadRepository { get(): Promise<BeneficioTerceraEdad>; }
