import type { ReadingImages } from '../models/ReadingImages';

export interface ReadingImagesRepository {
  findReadingImagesByMonth(month: string): Promise<ReadingImages[]>;
  findReadingImagesByMonthAndSector(
    month: string,
    sector: number
  ): Promise<ReadingImages[]>;
  findReadingImagesByCadastralKey(
    cadastralKey: string
  ): Promise<ReadingImages[]>;
  findAllReadingImages(): Promise<ReadingImages[]>;
}
