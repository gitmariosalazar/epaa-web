import type { YearlyOverdueSummary } from '../../domain/models/OverdueReading';
import type { PaymentsRepository } from '../../domain/repositories/PaymentsRepository';

export class FindYearlyOverdueSummaryUseCase {
  private readonly paymentsRepository: PaymentsRepository;

  constructor(paymentsRepository: PaymentsRepository) {
    this.paymentsRepository = paymentsRepository;
  }

  async execute(): Promise<YearlyOverdueSummary[]> {
    const yearlyOverdueSummary =
      await this.paymentsRepository.findYearlyOverdueSummary();
    return yearlyOverdueSummary;
  }
}
