import type { DashboardAdvanceResponse } from '../../domain/models/DashboardStats';
import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';

export class GetAdvanceDashboardStatsUseCase {
  private repository: ConnectionRepository;

  constructor(repository: ConnectionRepository) {
    this.repository = repository;
  }

  async execute(): Promise<DashboardAdvanceResponse> {
    return await this.repository.getAdvanceDashboardStats();
  }
}
