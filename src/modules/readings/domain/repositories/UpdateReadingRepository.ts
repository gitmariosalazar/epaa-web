import type { UpdateReadingRequest } from '../dto/request/UpdateReadingRequest';
import type { ReadingResponse } from '../models/Reading';

export interface UpdateReadingRepository {
  updateReading(
    readingId: number,
    request: UpdateReadingRequest
  ): Promise<ReadingResponse | null>;
}
