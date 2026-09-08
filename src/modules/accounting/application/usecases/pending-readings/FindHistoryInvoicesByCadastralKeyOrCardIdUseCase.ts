import type { PaymentsRepository } from '@/modules/accounting/domain/repositories/PaymentsRepository';
import type { PendingReading } from '@/modules/accounting/domain/models/PendingReading';
import type { DateRangeParams } from '@/modules/accounting/domain/dto/params/DataEntryParams';

export class FindHistoryInvoicesByCadastralKeyOrCardIdUseCase {
  private paymentsRepository: PaymentsRepository;

  constructor(paymentsRepository: PaymentsRepository) {
    this.paymentsRepository = paymentsRepository;
  }

  async execute(
    searchValue: string,
    period: DateRangeParams
  ): Promise<PendingReading[]> {
    return this.paymentsRepository.findHistoryInvoicesByCadastralKeyOrCardId(
      searchValue,
      period
    );
  }
}
