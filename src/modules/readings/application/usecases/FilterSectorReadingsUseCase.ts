import type {
  TakenReadingConnection,
  PendingReadingConnection
} from '../../domain/models/Reading';

export interface FilterCriteria {
  searchTerm: string;
  noveltyFilter: 'ALL' | 'WITH_NOVELTY' | 'WITHOUT_NOVELTY';
  type: 'completed' | 'missing' | null;
}

export interface IFilterStrategy {
  isSatisfiedBy(item: any, criteria: FilterCriteria): boolean;
}

export class GeneralSearchStrategy implements IFilterStrategy {
  isSatisfiedBy(item: any, criteria: FilterCriteria): boolean {
    if (!criteria.searchTerm || criteria.searchTerm.trim() === '') {
      return true;
    }

    const term = criteria.searchTerm.toLowerCase().trim();
    const cKey = item.cadastralKey?.toLowerCase() || '';
    const cName = item.clientName?.toLowerCase() || '';
    const cId = item.cardId?.toLowerCase() || '';

    return cKey.includes(term) || cName.includes(term) || cId.includes(term);
  }
}

export class NoveltyStatusStrategy implements IFilterStrategy {
  isSatisfiedBy(item: any, criteria: FilterCriteria): boolean {
    if (criteria.type !== 'completed' || criteria.noveltyFilter === 'ALL') {
      return true;
    }

    const hasNovelty = !!item.novelty && item.novelty.trim() !== '';

    if (criteria.noveltyFilter === 'WITH_NOVELTY') {
      return hasNovelty;
    }

    if (criteria.noveltyFilter === 'WITHOUT_NOVELTY') {
      return !hasNovelty;
    }

    return true;
  }
}

export class FilterSectorReadingsUseCase {
  private strategies: IFilterStrategy[];

  constructor(strategies?: IFilterStrategy[]) {
    this.strategies = strategies || [
      new GeneralSearchStrategy(),
      new NoveltyStatusStrategy()
    ];
  }

  execute(
    readings: (TakenReadingConnection | PendingReadingConnection)[],
    criteria: FilterCriteria
  ): (TakenReadingConnection | PendingReadingConnection)[] {
    if (!readings || readings.length === 0) return [];

    return readings.filter((item) =>
      this.strategies.every((strategy) =>
        strategy.isSatisfiedBy(item, criteria)
      )
    );
  }
}
