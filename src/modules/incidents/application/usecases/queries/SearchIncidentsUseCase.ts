import type { InterfaceIncidentRepository } from '@/modules/incidents/domain/repositories/incident.interface.repository';
import type { IncidentDetailRowResponse } from '@/modules/incidents/domain/schemas/dtos/response/view_incident.response';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class SearchIncidentsUseCase {
  private readonly incidentRepository: InterfaceIncidentRepository;

  constructor(incidentRepository: InterfaceIncidentRepository) {
    this.incidentRepository = incidentRepository;
  }

  async execute(
    filters: {
      connectionId?: string | null;
      status?: string | null;
      priority?: string | null;
      categoryId?: number | null;
      sector?: string | null;
      reference?: string | null;
      reportDate?: Date | null;
      reportRangeDate?: { start: Date; end: Date } | null;
    },
    limit?: number,
    offset?: number
  ): Promise<ApiResponse<IncidentDetailRowResponse[]>> {
    try {
      const incidents = await this.incidentRepository.findIncidents(
        filters,
        limit,
        offset
      );
      return incidents;
    } catch (error) {
      throw error;
    }
  }
}
