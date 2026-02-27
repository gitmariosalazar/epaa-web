import type { PaymentReading } from '../../domain/models/PaymentReading';
import type { PaymentsRepository } from '../../domain/repositories/PaymentsRepository';

export class FindAllPaymentReadingByDateUseCase {
  private readonly paymentsRepository: PaymentsRepository;

  constructor(paymentsRepository: PaymentsRepository) {
    this.paymentsRepository = paymentsRepository;
  }

  execute(paymentDate: string): Promise<PaymentReading[]> {
    return this.paymentsRepository.findAllPaymentReadingPayrollsByDate(
      paymentDate
    );
  }
}
