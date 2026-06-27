import type { InterfaceIncidentRepository } from '@/modules/incidents/domain/repositories/incident.interface.repository';
import type { IncidentDetailRowResponse } from '@/modules/incidents/domain/schemas/dtos/response/view_incident.response';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class FindIncidentsByConnectionUseCase {
  private readonly incidentRepository: InterfaceIncidentRepository;

  constructor(incidentRepository: InterfaceIncidentRepository) {
    this.incidentRepository = incidentRepository;
  }

  async execute(
    connectionId: string
  ): Promise<ApiResponse<IncidentDetailRowResponse[]>> {
    try {
      const incidents =
        await this.incidentRepository.findIncidentsByConnection(connectionId);
      return incidents;
    } catch (error) {
      throw error;
    }
  }
}
