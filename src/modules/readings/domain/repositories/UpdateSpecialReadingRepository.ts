import type { UpdateSpecialReadingRequest } from '../dto/request/UpdateSpecialReadingRequest';
import type { ReadingResponse } from '../models/Reading';

export interface UpdateSpecialReadingRepository {
  updateSpecialReading(
    readingId: number,
    request: UpdateSpecialReadingRequest
  ): Promise<ReadingResponse | null>;
}
