import type { ReadingNovelty } from '../models/ReadingNovelty';

export interface GetReadingNoveltyRepository {
  getReadingByNovelty(
    dateMonth: string,
    novelty?: string,
    sector?: number,
    userId?: string
  ): Promise<ReadingNovelty[]>;
}
