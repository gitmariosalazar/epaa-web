import type { ReadingImages } from '../../domain/models/ReadingImages';
import type { ReadingImagesRepository } from '../../domain/repositories/ReadingImagesRepository';

export class FindReadingImagesByFilterUseCase {
  private readonly repository: ReadingImagesRepository;

  constructor(repository: ReadingImagesRepository) {
    this.repository = repository;
  }

  async execute(filter: {
    month?: string;
    cadastralKey?: string;
    sector?: number;
    date?: string;
  }): Promise<ReadingImages[]> {
    return this.repository.findReadingImagesByFilter(filter);
  }
}
