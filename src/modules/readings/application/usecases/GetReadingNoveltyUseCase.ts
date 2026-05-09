import type { ReadingNovelty } from '../../domain/models/ReadingNovelty';
import type { GetReadingNoveltyRepository } from '../../domain/repositories/GetReadingNoveltyRepository';

export class GetReadingNoveltyUseCase {
  private readonly getReadingNoveltyRepository: GetReadingNoveltyRepository;

  constructor(getReadingNoveltyRepository: GetReadingNoveltyRepository) {
    this.getReadingNoveltyRepository = getReadingNoveltyRepository;
  }

  async execute(
    dateMonth: string,
    novelty?: string,
    sector?: number
  ): Promise<ReadingNovelty[]> {
    return this.getReadingNoveltyRepository.getReadingByNovelty(
      dateMonth,
      novelty,
      sector
    );
  }
}
