import type { UpdateSpecialReadingRequest } from '../../domain/dto/request/UpdateSpecialReadingRequest';
import type { ReadingResponse } from '../../domain/models/Reading';
import type { UpdateSpecialReadingRepository } from '../../domain/repositories/UpdateSpecialReadingRepository';

export class UpdateSpecialReadingUseCase {
  constructor(private readonly repository: UpdateSpecialReadingRepository) {}

  async execute(
    readingId: number,
    request: UpdateSpecialReadingRequest
  ): Promise<ReadingResponse | null> {
    return this.repository.updateSpecialReading(readingId, request);
  }
}
