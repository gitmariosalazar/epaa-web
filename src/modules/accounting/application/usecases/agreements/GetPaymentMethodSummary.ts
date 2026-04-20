import type { DateRangeParams } from '@/modules/accounting/domain/dto/params/DataEntryParams';
import type { PaymentMethodSummary } from '@/modules/accounting/domain/models/Agreements';
import type { AgreementsRepository } from '@/modules/accounting/domain/repositories/AgreementsRepository';

export class GetPaymentMethodSummaryUseCase {
  private readonly repository: AgreementsRepository;
  constructor(repository: AgreementsRepository) {
    this.repository = repository;
  }

  async execute(params: DateRangeParams): Promise<PaymentMethodSummary[]> {
    const result = await this.repository.getPaymentMethodSummary(params);
    return result;
  }
}
