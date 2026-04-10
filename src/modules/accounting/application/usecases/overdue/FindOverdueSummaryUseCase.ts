import type { OverdueSummary } from '../../../domain/models/OverdueReading';
import type { PaymentsRepository } from '../../../domain/repositories/PaymentsRepository';

export class FindOverdueSummaryUseCase {
  private readonly paymentsRepository: PaymentsRepository;

  constructor(paymentsRepository: PaymentsRepository) {
    this.paymentsRepository = paymentsRepository;
  }

  async execute(): Promise<OverdueSummary | null> {
    const overdueSummary = await this.paymentsRepository.findOverdueSummary();
    return overdueSummary;
  }
}
