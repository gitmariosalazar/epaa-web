import type { CreateReadingRequest } from '../../domain/dto/request/CreateReadingRequest';
import type { ReadingResponse } from '../../domain/models/Reading';
import type { CreateReadingRepository } from '../../domain/repositories/CreateReadingRepository';

export class CreateReadingUseCase {
  private readonly createReadingRepository: CreateReadingRepository;

  constructor(createReadingRepository: CreateReadingRepository) {
    this.createReadingRepository = createReadingRepository;
  }

  async execute(
    request: CreateReadingRequest
  ): Promise<ReadingResponse | null> {
    return this.createReadingRepository.createReading(request);
  }
}
