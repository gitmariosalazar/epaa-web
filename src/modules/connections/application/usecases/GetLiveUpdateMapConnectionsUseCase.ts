import type { LiveMapConnectionResponse } from '../../domain/models/DashboardStats';
import type { ConnectionRepository } from '../../domain/repositories/ConnectionRepository';

export class GetLiveUpdateMapConnectionsUseCase {
  private readonly connectionRepository: ConnectionRepository;
  constructor(connectionRepository: ConnectionRepository) {
    this.connectionRepository = connectionRepository;
  }

  async execute(): Promise<LiveMapConnectionResponse[]> {
    return this.connectionRepository.getLiveUpdateMapConnections();
  }
}
