import type { ReadingHistory } from '../models/ReadingHistory';

export interface ReadingHistoryRepository {
  getReadingHistory(
    cadastralKey: string,
    limit: number,
    offset: number
  ): Promise<ReadingHistory[]>;
}
