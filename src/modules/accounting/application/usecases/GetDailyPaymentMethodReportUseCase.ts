import type { DateRangeParams } from '../../domain/dto/params/DataEntryParams';
import type { DailyPaymentMethodReport } from '../../domain/models/EntryData';
import type { EntryDataRepository } from '../../domain/repositories/EntryDataRepository';

export class GetDailyPaymentMethodReportUseCase {
  private readonly dataEntryRepository: EntryDataRepository;

  constructor(entryDataRepository: EntryDataRepository) {
    this.dataEntryRepository = entryDataRepository;
  }

  execute(params: DateRangeParams): Promise<DailyPaymentMethodReport[]> {
    return this.dataEntryRepository.getDailyPaymentMethodReport(params);
  }
}
