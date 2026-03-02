import type { ReadingImages } from '../../domain/models/ReadingImages';
import type { ReadingImagesRepository } from '../../domain/repositories/ReadingImagesRepository';

export class ReadingImagesUseCase {
  private readonly repository: ReadingImagesRepository;

  constructor(repository: ReadingImagesRepository) {
    this.repository = repository;
  }

  async executeFindByMonth(month: string): Promise<ReadingImages[]> {
    return this.repository.findReadingImagesByMonth(month);
  }

  async executeFindByMonthAndSector(
    month: string,
    sector: number
  ): Promise<ReadingImages[]> {
    return this.repository.findReadingImagesByMonthAndSector(month, sector);
  }

  async executeFindByCadastralKey(
    cadastralKey: string
  ): Promise<ReadingImages[]> {
    return this.repository.findReadingImagesByCadastralKey(cadastralKey);
  }

  async executeFindAll(): Promise<ReadingImages[]> {
    return this.repository.findAllReadingImages();
  }
}
