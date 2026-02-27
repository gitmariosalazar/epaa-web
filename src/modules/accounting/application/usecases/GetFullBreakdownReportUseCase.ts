import type { DateRangeParams } from '../../domain/dto/params/DataEntryParams';
import type { FullBreakdownReport } from '../../domain/models/EntryData';
import type { EntryDataRepository } from '../../domain/repositories/EntryDataRepository';

export class GetFullBreakdownReportUseCase {
  private readonly dataEntryRepository: EntryDataRepository;

  constructor(entryDataRepository: EntryDataRepository) {
    this.dataEntryRepository = entryDataRepository;
  }

  execute(params: DateRangeParams): Promise<FullBreakdownReport[]> {
    return this.dataEntryRepository.getFullBreakdownReport(params);
  }
}
