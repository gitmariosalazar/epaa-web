import { FindAllPaymentReadingByDateUseCase } from '../../application/usecases/FindAllPaymentReadingByDateUseCase';
import { FindAllPaymentByDateAndOrderValueUseCase } from '../../application/usecases/FindAllPaymentByDateAndOrderValueUseCase';
import { FindAllPaymentsByDateRangeUseCase } from '../../application/usecases/FindAllPaymentsByDateRange';
import { createContext, useContext } from 'react';
import { PaymentsRepositoryImpl } from '../../infrastructure/repositories/PaymentsRepositoryImpl';
import { FindAllOverduePaymentsUseCase } from '../../application/usecases/FindAllOverduePaymentsUseCase';
import { FindPendingReadingsByCadastralKeyOrCardIdUseCase } from '../../application/usecases/FindPendingReadingsByCadastralKeyOrCardIdUseCase';
import { FindOverdueSummaryUseCase } from '../../application/usecases/FindOverdueSummaryUseCase';
import { FindYearlyOverdueSummaryUseCase } from '../../application/usecases/FindYearlyOverdueSummaryUseCase';

interface PaymentsContextType {
  findAllPaymentReadingPayrollsByDate: FindAllPaymentReadingByDateUseCase;
  findAllPaymentByDateAndOrderValue: FindAllPaymentByDateAndOrderValueUseCase;
  findAllPaymentsByDateRange: FindAllPaymentsByDateRangeUseCase;
  findAllOverduePayments: FindAllOverduePaymentsUseCase;
  findPendingReadingsByCadastralKeyOrCardId: FindPendingReadingsByCadastralKeyOrCardIdUseCase;
  findOverdueSummary: FindOverdueSummaryUseCase;
  findYearlyOverdueSummary: FindYearlyOverdueSummaryUseCase;
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
    findYearlyOverdueSummary: new FindYearlyOverdueSummaryUseCase(repository)
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
