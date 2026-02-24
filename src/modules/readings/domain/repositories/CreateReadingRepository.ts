import type { CreateReadingRequest } from '../dto/request/CreateReadingRequest';
import type { ReadingResponse } from '../models/Reading';

export interface CreateReadingRepository {
  createReading(request: CreateReadingRequest): Promise<ReadingResponse | null>;
}
