import type { InterfaceIncidentRepository } from '@/modules/incidents/domain/repositories/incident.interface.repository';
import type { IncidentDetailRowResponse } from '@/modules/incidents/domain/schemas/dtos/response/view_incident.response';

/**
 * FindActiveIncidentsByConnectionUseCase
 *
 * Single Responsibility: obtiene los incidentes de una acometida
 * que todavía están activos (estado diferente de RESUELTO).
 *
 * Open/Closed: el criterio "activo" está encapsulado aquí, sin
 * modificar el repositorio ni otros casos de uso.
 *
 * Dependency Inversion: depende de la abstracción
 * InterfaceIncidentRepository, no de una implementación concreta.
 */
export class FindActiveIncidentsByConnectionUseCase {
  private readonly incidentRepository: InterfaceIncidentRepository;

  constructor(incidentRepository: InterfaceIncidentRepository) {
    this.incidentRepository = incidentRepository;
  }

  async execute(connectionId: string): Promise<IncidentDetailRowResponse[]> {
    try {
      const response = await this.incidentRepository.findIncidents({ connectionId });
      const allIncidents: IncidentDetailRowResponse[] = response.data ?? [];

      // Regla de negocio: "activo" = estado distinto de RESUELTO
      return allIncidents.filter(
        (incident) => incident.status !== 'RESUELTO'
      );
    } catch (error) {
      throw error;
    }
  }
}
