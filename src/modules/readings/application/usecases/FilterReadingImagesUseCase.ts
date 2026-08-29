import type { ReadingImages } from '../../domain/models/ReadingImages';

export interface ReadingImagesFilterCriteria {
  novelty?: string;
}

export interface IReadingImagesFilterStrategy {
  isSatisfiedBy(item: ReadingImages, criteria: ReadingImagesFilterCriteria): boolean;
}

export class NoveltyReadingImagesStrategy implements IReadingImagesFilterStrategy {
  isSatisfiedBy(item: ReadingImages, criteria: ReadingImagesFilterCriteria): boolean {
    if (!criteria.novelty) {
      return true;
    }

    // Match exactly the novelty string from the model
    return item.novelty === criteria.novelty;
  }
}

export class FilterReadingImagesUseCase {
  private strategies: IReadingImagesFilterStrategy[];

  constructor(strategies?: IReadingImagesFilterStrategy[]) {
    this.strategies = strategies || [
      new NoveltyReadingImagesStrategy()
    ];
  }

  execute(
    readings: ReadingImages[],
    criteria: ReadingImagesFilterCriteria
  ): ReadingImages[] {
    if (!readings || readings.length === 0) return [];

    return readings.filter((item) =>
      this.strategies.every((strategy) =>
        strategy.isSatisfiedBy(item, criteria)
      )
    );
  }
}
