import type { InterfaceIncidentRepository } from '@/modules/incidents/domain/repositories/incident.interface.repository';
import type { IncidentDashboardResponseDto } from '@/modules/incidents/domain/schemas/dtos/response/incident-dashboard.dto';

export class GetIncidentDashboardKpisUseCase {
  private readonly incidentRepository: InterfaceIncidentRepository;

  constructor(incidentRepository: InterfaceIncidentRepository) {
    this.incidentRepository = incidentRepository;
  }

  async execute(): Promise<IncidentDashboardResponseDto | null> {
    try {
      const response = await this.incidentRepository.getIncidentDashboardKpis();
      return response;
    } catch (error) {
      throw error;
    }
  }
}
