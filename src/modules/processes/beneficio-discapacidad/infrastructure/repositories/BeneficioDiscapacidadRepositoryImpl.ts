import type { BeneficioDiscapacidadRepository } from '../../domain/repositories/BeneficioDiscapacidadRepository';
import type { BeneficioDiscapacidad } from '../../domain/models/BeneficioDiscapacidad';
import { BENEFICIO_DISCAPACIDAD_DATA } from '../data/BeneficioDiscapacidadRequisitos';

export class BeneficioDiscapacidadRepositoryImpl implements BeneficioDiscapacidadRepository {
  async get(): Promise<BeneficioDiscapacidad> { return BENEFICIO_DISCAPACIDAD_DATA; }
}
