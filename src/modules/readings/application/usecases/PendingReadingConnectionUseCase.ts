import type { PendingReadingConnection } from '../../domain/models/Reading';
import type { PendingReadingConnectionRepository } from '../../domain/repositories/PendingReadingConnectionRepository';

export class PendingReadingConnectionUseCase {
  private readonly pendingReadingConnectionRepository: PendingReadingConnectionRepository;

  constructor(
    pendingReadingConnectionRepository: PendingReadingConnectionRepository
  ) {
    this.pendingReadingConnectionRepository =
      pendingReadingConnectionRepository;
  }

  async execute(
    dateMonth: string,
    sector?: number
  ): Promise<PendingReadingConnection[]> {
    return this.pendingReadingConnectionRepository.getPendingReadingsByMonth(
      dateMonth,
      sector
    );
  }
}
