import type { ReadingHistory } from '../../domain/models/ReadingHistory';
import type { ReadingHistoryRepository } from '../../domain/repositories/ReadinHistoryRepository';

export class GetReadingHistoryUseCase {
  private readonly readingHistoryRepository: ReadingHistoryRepository;

  constructor(readingHistoryRepository: ReadingHistoryRepository) {
    this.readingHistoryRepository = readingHistoryRepository;
  }

  async execute(
    cadastralKey: string,
    limit: number,
    offset: number
  ): Promise<ReadingHistory[]> {
    return this.readingHistoryRepository.getReadingHistory(
      cadastralKey,
      limit,
      offset
    );
  }
}
