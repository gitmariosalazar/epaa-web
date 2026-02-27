import type { DateRangeParams } from '../../domain/dto/params/DataEntryParams';
import type { DailyCollectorSummary } from '../../domain/models/EntryData';
import type { EntryDataRepository } from '../../domain/repositories/EntryDataRepository';

export class GetDailyCollectorSummaryUseCase {
  private readonly dataEntryRepository: EntryDataRepository;

  constructor(entryDataRepository: EntryDataRepository) {
    this.dataEntryRepository = entryDataRepository;
  }

  execute(params: DateRangeParams): Promise<DailyCollectorSummary[]> {
    return this.dataEntryRepository.getDailyCollectorSummary(params);
  }
}
