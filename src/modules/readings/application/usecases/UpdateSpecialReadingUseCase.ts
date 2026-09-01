import type { UpdateSpecialReadingRequest } from '../../domain/dto/request/UpdateSpecialReadingRequest';
import type { ReadingResponse } from '../../domain/models/Reading';
import type { UpdateSpecialReadingRepository } from '../../domain/repositories/UpdateSpecialReadingRepository';

export class UpdateSpecialReadingUseCase {
  private readonly repository: UpdateSpecialReadingRepository;

  constructor(repository: UpdateSpecialReadingRepository) {
    this.repository = repository;
  }

  async execute(
    readingId: number,
    request: UpdateSpecialReadingRequest
  ): Promise<ReadingResponse | null> {
    return this.repository.updateSpecialReading(readingId, request);
  }
}
