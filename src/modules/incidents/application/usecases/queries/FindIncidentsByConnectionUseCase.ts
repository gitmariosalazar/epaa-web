import type { InterfaceIncidentRepository } from '@/modules/incidents/domain/repositories/incident.interface.repository';
import type { IncidentResponse } from '@/modules/incidents/domain/schemas/dtos/response/incident.response';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';

export class FindIncidentsByConnectionUseCase {
  private readonly incidentRepository: InterfaceIncidentRepository;

  constructor(incidentRepository: InterfaceIncidentRepository) {
    this.incidentRepository = incidentRepository;
  }

  async execute(
    connectionId: string
  ): Promise<ApiResponse<IncidentResponse[]>> {
    try {
      const incidents =
        await this.incidentRepository.findIncidentsByConnection(connectionId);
      return incidents;
    } catch (error) {
      throw error;
    }
  }
}
