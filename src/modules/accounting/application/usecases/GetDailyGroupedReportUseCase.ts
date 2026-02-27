import type { DateRangeParams } from '../../domain/dto/params/DataEntryParams';
import type { DailyGroupedReport } from '../../domain/models/EntryData';
import type { EntryDataRepository } from '../../domain/repositories/EntryDataRepository';

export class GetDailyGroupedReportUseCase {
  private readonly dataEntryRepository: EntryDataRepository;

  constructor(entryDataRepository: EntryDataRepository) {
    this.dataEntryRepository = entryDataRepository;
  }

  execute(params: DateRangeParams): Promise<DailyGroupedReport[]> {
    return this.dataEntryRepository.getDailyGroupedReport(params);
  }
}
