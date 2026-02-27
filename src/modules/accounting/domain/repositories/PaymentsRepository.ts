import type { Payment } from '../models/Payment';
import type { PaymentReading } from '../models/PaymentReading';

export interface PaymentsRepository {
  findAllPaymentReadingPayrollsByDate(
    paymentDate: string
  ): Promise<PaymentReading[]>;

  findAllPaymentByDateAndOrderValue(
    paymentDate: string,
    orderValue: number
  ): Promise<Payment[]>;
  findAllPaymentsByDateRange(
    initDate: string,
    endDate: string,
    limit: number,
    offset: number
  ): Promise<Payment[]>;
}
