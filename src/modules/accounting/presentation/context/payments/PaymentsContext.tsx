import { FindAllPaymentReadingByDateUseCase } from '../../../application/usecases/payments/FindAllPaymentReadingByDateUseCase';
import { FindAllPaymentByDateAndOrderValueUseCase } from '../../../application/usecases/payments/FindAllPaymentByDateAndOrderValueUseCase';
import { FindAllPaymentsByDateRangeUseCase } from '../../../application/usecases/payments/FindAllPaymentsByDateRange';
import { createContext, useContext } from 'react';
import { PaymentsRepositoryImpl } from '../../../infrastructure/repositories/PaymentsRepositoryImpl';
import { FindAllOverduePaymentsUseCase } from '../../../application/usecases/overdue/FindAllOverduePaymentsUseCase';
import { FindPendingReadingsByCadastralKeyOrCardIdUseCase } from '../../../application/usecases/pending-readings/FindPendingReadingsByCadastralKeyOrCardIdUseCase';
import { FindOverdueSummaryUseCase } from '../../../application/usecases/overdue/FindOverdueSummaryUseCase';
import { FindYearlyOverdueSummaryUseCase } from '../../../application/usecases/overdue/FindYearlyOverdueSummaryUseCase';
import { FindMonthlyDebtSummaryUseCase } from '../../../application/usecases/overdue/FindMonthlyDebtSummaryUseCase';

interface PaymentsContextType {
  findAllPaymentReadingPayrollsByDate: FindAllPaymentReadingByDateUseCase;
  findAllPaymentByDateAndOrderValue: FindAllPaymentByDateAndOrderValueUseCase;
  findAllPaymentsByDateRange: FindAllPaymentsByDateRangeUseCase;
  findAllOverduePayments: FindAllOverduePaymentsUseCase;
  findPendingReadingsByCadastralKeyOrCardId: FindPendingReadingsByCadastralKeyOrCardIdUseCase;
  findOverdueSummary: FindOverdueSummaryUseCase;
  findYearlyOverdueSummary: FindYearlyOverdueSummaryUseCase;
  findMonthlyDebtSummary: FindMonthlyDebtSummaryUseCase;
}

const PaymentsContext = createContext<PaymentsContextType | null>(null);

export const PaymentsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  // Each use case gets its own repository instance (Dependency Inversion)
  const repository = new PaymentsRepositoryImpl();

  const value = {
    findAllPaymentReadingPayrollsByDate: new FindAllPaymentReadingByDateUseCase(
      repository
    ),
    findAllPaymentByDateAndOrderValue:
      new FindAllPaymentByDateAndOrderValueUseCase(repository),
    findAllPaymentsByDateRange: new FindAllPaymentsByDateRangeUseCase(
      repository
    ),
    findAllOverduePayments: new FindAllOverduePaymentsUseCase(repository),
    findPendingReadingsByCadastralKeyOrCardId:
      new FindPendingReadingsByCadastralKeyOrCardIdUseCase(repository),
    findOverdueSummary: new FindOverdueSummaryUseCase(repository),
    findYearlyOverdueSummary: new FindYearlyOverdueSummaryUseCase(repository),
    findMonthlyDebtSummary: new FindMonthlyDebtSummaryUseCase(repository)
  };

  return (
    <PaymentsContext.Provider value={value}>
      {children}
    </PaymentsContext.Provider>
  );
};

export const usePaymentsContext = () => {
  const context = useContext(PaymentsContext);
  if (!context) {
    throw new Error(
      'usePaymentsContext must be used within a PaymentsProvider'
    );
  }
  return context;
};
