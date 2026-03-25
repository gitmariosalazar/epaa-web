import type { UpdateReadingRequest } from '../../domain/dto/request/UpdateReadingRequest';
import type { ReadingResponse } from '../../domain/models/Reading';
import type { UpdateReadingRepository } from '../../domain/repositories/UpdateReadingRepository';

export class UpdateReadingUseCase {
  private readonly updateReadingRepository: UpdateReadingRepository;

  constructor(updateReadingRepository: UpdateReadingRepository) {
    this.updateReadingRepository = updateReadingRepository;
  }

  async execute(
    readingId: number,
    request: UpdateReadingRequest
  ): Promise<ReadingResponse | null> {
    return this.updateReadingRepository.updateReading(readingId, request);
  }
}
