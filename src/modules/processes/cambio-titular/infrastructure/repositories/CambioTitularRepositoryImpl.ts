import type { CambioTitularRepository } from '../../domain/repositories/CambioTitularRepository';
import type { CambioTitular } from '../../domain/models/CambioTitular';
import { CAMBIO_TITULAR_DATA } from '../data/CambioTitularRequisitos';

export class CambioTitularRepositoryImpl implements CambioTitularRepository {
  async get(): Promise<CambioTitular> { return CAMBIO_TITULAR_DATA; }
}
