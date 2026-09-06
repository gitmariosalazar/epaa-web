import type { ReadingImages } from '../../domain/models/ReadingImages';

export interface ReadingImagesFilterCriteria {
  novelty?: string;
  updatedStatus?: string;
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

export class UpdatedStatusReadingImagesStrategy implements IReadingImagesFilterStrategy {
  isSatisfiedBy(item: ReadingImages, criteria: ReadingImagesFilterCriteria): boolean {
    if (!criteria.updatedStatus) {
      return true;
    }

    if (criteria.updatedStatus === 'updated') {
      return item.updatedStatus === true;
    }

    if (criteria.updatedStatus === 'not_updated') {
      return item.updatedStatus === false;
    }

    return true;
  }
}

export class FilterReadingImagesUseCase {
  private strategies: IReadingImagesFilterStrategy[];

  constructor(strategies?: IReadingImagesFilterStrategy[]) {
    this.strategies = strategies || [
      new NoveltyReadingImagesStrategy(),
      new UpdatedStatusReadingImagesStrategy()
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
