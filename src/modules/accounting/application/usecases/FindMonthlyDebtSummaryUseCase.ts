import type { MonthlyDebtSummary } from '../../domain/models/OverdueReading';
import type { PaymentsRepository } from '../../domain/repositories/PaymentsRepository';

export class FindMonthlyDebtSummaryUseCase {
  private readonly paymentsRepository: PaymentsRepository;

  constructor(paymentsRepository: PaymentsRepository) {
    this.paymentsRepository = paymentsRepository;
  }

  async execute(): Promise<MonthlyDebtSummary[]> {
    const monthlyDebtSummary =
      await this.paymentsRepository.findMonthlyDebtSummary();
    return monthlyDebtSummary;
  }
}
