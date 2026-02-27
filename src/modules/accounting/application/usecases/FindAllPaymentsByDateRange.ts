import type { Payment } from '../../domain/models/Payment';
import type { PaymentsRepository } from '../../domain/repositories/PaymentsRepository';

export class FindAllPaymentsByDateRangeUseCase {
  private readonly paymentsRepository: PaymentsRepository;

  constructor(paymentsRepository: PaymentsRepository) {
    this.paymentsRepository = paymentsRepository;
  }

  execute(
    initDate: string,
    endDate: string,
    limit: number,
    offset: number
  ): Promise<Payment[]> {
    return this.paymentsRepository.findAllPaymentsByDateRange(
      initDate,
      endDate,
      limit,
      offset
    );
  }
}
