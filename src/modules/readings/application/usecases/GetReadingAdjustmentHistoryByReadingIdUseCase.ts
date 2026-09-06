import type { HistorialAjusteLectura } from '@/modules/readings/domain/models/Reading';
import type { GetReadingAdjustmentHistoryByReadingIdRepository } from '@/modules/readings/domain/repositories/GetReadingAdjustmentHistoryByReadingIdRepository';

export class GetReadingAdjustmentHistoryByReadingIdUseCase {
  private readonly repository: GetReadingAdjustmentHistoryByReadingIdRepository;

  constructor(repository: GetReadingAdjustmentHistoryByReadingIdRepository) {
    this.repository = repository;
  }

  async execute(readingId: number): Promise<HistorialAjusteLectura[]> {
    return this.repository.getReadingAdjustmentHistoryByReadingId(readingId);
  }
}
