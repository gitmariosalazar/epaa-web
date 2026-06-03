// ============================================================
// APPLICATION — SubmitSolicitudTramiteUseCase (SRP)
// Orchestrates the submission of a new tramite request.
// Business rules: validates required fields before delegating
// to the repository — domain logic stays out of the UI.
// ============================================================

import type { TramiteRepository } from '../../domain/repositories/TramiteRepository';
import type { SolicitudTramite } from '../../domain/models/Tramite';

export interface SubmitSolicitudDTO {
  tramiteId: string;
  tramiteNombre: string;
  titularNombre: string;
  titularCedula: string;
  titularEmail: string;
  observaciones?: string;
}

export class SubmitSolicitudTramiteUseCase {
  private readonly tramiteRepository: TramiteRepository;
  constructor(tramiteRepository: TramiteRepository) {
    this.tramiteRepository = tramiteRepository;
  }


  async execute(dto: SubmitSolicitudDTO): Promise<SolicitudTramite> {
    // Business rule: cedula must be 10 digits
    if (!/^\d{10}$/.test(dto.titularCedula)) {
      throw new Error('La cédula debe contener exactamente 10 dígitos numéricos.');
    }

    // Business rule: valid email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.titularEmail)) {
      throw new Error('El correo electrónico ingresado no es válido.');
    }

    // Business rule: titularNombre required
    if (!dto.titularNombre.trim()) {
      throw new Error('El nombre completo del titular es requerido.');
    }

    return this.tramiteRepository.submitSolicitud(dto);
  }
}
