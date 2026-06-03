import type { BeneficioTerceraEdadRepository } from '../../domain/repositories/BeneficioTerceraEdadRepository';
import type { BeneficioTerceraEdad } from '../../domain/models/BeneficioTerceraEdad';
import { BENEFICIO_TERCERA_EDAD_DATA } from '../data/BeneficioTerceraEdadRequisitos';

export class BeneficioTerceraEdadRepositoryImpl implements BeneficioTerceraEdadRepository {
  async get(): Promise<BeneficioTerceraEdad> { return BENEFICIO_TERCERA_EDAD_DATA; }
}
