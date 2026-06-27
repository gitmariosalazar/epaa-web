import type { InterfaceIncidentRepository } from '@/modules/incidents/domain/repositories/incident.interface.repository';
import type { IncidentDetailRowResponse } from '@/modules/incidents/domain/schemas/dtos/response/view_incident.response';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class SearchIncidentsUseCase {
  private readonly incidentRepository: InterfaceIncidentRepository;

  constructor(incidentRepository: InterfaceIncidentRepository) {
    this.incidentRepository = incidentRepository;
  }

  async execute(filters: {
    connectionId?: string | null;
    status?: string | null;
    priority?: string | null;
    incidentTypeId?: number | null;
  }): Promise<ApiResponse<IncidentDetailRowResponse[]>> {
    try {
      const incidents = await this.incidentRepository.findIncidents(filters);
      return incidents;
    } catch (error) {
      throw error;
    }
  }
}
