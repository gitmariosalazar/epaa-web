// ============================================================
// DOMAIN — TramiteRepository Interface (DIP)
// The application depends on this abstraction, never on
// a concrete implementation. Classic Dependency Inversion.
// ============================================================

import type { Tramite, SolicitudTramite, CategoriaTramite } from '../models/Tramite';

export interface TramiteRepository {
  /** Returns all active tramite definitions */
  getAll(): Promise<Tramite[]>;

  /** Returns tramites filtered by category */
  getByCategoria(categoria: CategoriaTramite): Promise<Tramite[]>;

  /** Returns a single tramite definition by its id */
  getById(id: string): Promise<Tramite | null>;

  /** Returns submitted requests for the authenticated user */
  getMisSolicitudes(): Promise<SolicitudTramite[]>;

  /** Submits a new tramite request */
  submitSolicitud(
    data: Omit<SolicitudTramite, 'id' | 'estado' | 'fechaSolicitud'>
  ): Promise<SolicitudTramite>;
}
