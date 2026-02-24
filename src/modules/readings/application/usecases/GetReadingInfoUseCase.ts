import type { ReadingInfo } from '../../domain/models/ReadingInfoResponse';
import type { ReadingInfoRepository } from '../../domain/repositories/ReadingInfoRepository';

export class GetReadingInfoUseCase {
  private readonly readingInfoRepository: ReadingInfoRepository;

  constructor(readingInfoRepository: ReadingInfoRepository) {
    this.readingInfoRepository = readingInfoRepository;
  }

  async execute(cadastralKey: string): Promise<ReadingInfo[]> {
    return this.readingInfoRepository.getReadingInfo(cadastralKey);
  }
}
