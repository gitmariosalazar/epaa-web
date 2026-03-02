import type { TakenReadingConnection } from '../../domain/models/Reading';
import type { TakenReadingConnectionRepository } from '../../domain/repositories/TakenReadingConnectionRepository';

export class TakenReadingConnectionUseCase {
  private readonly takenReadingConnectionRepository: TakenReadingConnectionRepository;

  constructor(
    takenReadingConnectionRepository: TakenReadingConnectionRepository
  ) {
    this.takenReadingConnectionRepository = takenReadingConnectionRepository;
  }

  async executeGetTakenReadingsByMonth(
    dateMonth: string,
    sector?: number
  ): Promise<TakenReadingConnection[]> {
    return this.takenReadingConnectionRepository.getTakenReadingsByMonth(
      dateMonth,
      sector
    );
  }

  async executeGetTakenReadingEstimatesOrAverage(
    month: string,
    sector?: number
  ): Promise<TakenReadingConnection[]> {
    return this.takenReadingConnectionRepository.getTakenReadingEstimatesOrAverage(
      month,
      sector
    );
  }
}
