import type { BeneficioDiscapacidad } from '../models/BeneficioDiscapacidad';
export interface BeneficioDiscapacidadRepository { get(): Promise<BeneficioDiscapacidad>; }
