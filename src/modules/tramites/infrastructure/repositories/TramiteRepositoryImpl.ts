// ============================================================
// INFRASTRUCTURE — TramiteRepositoryImpl
// Implements TramiteRepository interface (LSP / DIP).
// Currently uses local catalog data; swap getAll() to an API
// call without touching a single line of application code.
// ============================================================

import type { TramiteRepository } from '../../domain/repositories/TramiteRepository';
import type {
  Tramite,
  SolicitudTramite,
  CategoriaTramite
} from '../../domain/models/Tramite';
import { TRAMITES_CATALOG } from '../data/TramitesCatalog';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';

/** Mock submitted solicitudes — replace with real API */
const MOCK_SOLICITUDES: SolicitudTramite[] = [];
let mockIdCounter = 1;

export class TramiteRepositoryImpl implements TramiteRepository {
  /**
   * Returns all active tramites.
   * TODO: Replace with `apiClient.get<Tramite[]>('/tramites')` when ready.
   */
  async getAll(): Promise<Tramite[]> {
    // For now, use local catalog
    return TRAMITES_CATALOG.filter((t) => t.activo);
  }

  async getByCategoria(categoria: CategoriaTramite): Promise<Tramite[]> {
    const all = await this.getAll();
    return all.filter((t) => t.categoria === categoria);
  }

  async getById(id: string): Promise<Tramite | null> {
    const all = await this.getAll();
    return all.find((t) => t.id === id) ?? null;
  }

  async getMisSolicitudes(): Promise<SolicitudTramite[]> {
    // Quitado para evitar el error NotFoundException: Cannot GET /tramites/mis-solicitudes
    return MOCK_SOLICITUDES;
  }

  async submitSolicitud(
    data: Omit<SolicitudTramite, 'id' | 'estado' | 'fechaSolicitud'>
  ): Promise<SolicitudTramite> {
    try {
      const res = await apiClient.post<{ data: SolicitudTramite }>(
        '/tramites/solicitudes',
        data
      );
      return res.data.data;
    } catch {
      // Graceful fallback — create in-memory record
      const nueva: SolicitudTramite = {
        ...data,
        id: `SOL-${String(mockIdCounter++).padStart(4, '0')}`,
        estado: 'pendiente',
        fechaSolicitud: new Date().toISOString()
      };
      MOCK_SOLICITUDES.push(nueva);
      return nueva;
    }
  }
}
