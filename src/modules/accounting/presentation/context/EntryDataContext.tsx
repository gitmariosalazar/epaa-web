import { createContext, useContext } from 'react';
import React from 'react';
import { EntryDataRepositoryImpl } from '../../infrastructure/repositories/EntryDataRepositoryImpl';
import { GetDailyGroupedReportUseCase } from '../../application/usecases/GetDailyGroupedReportUseCase';
import { GetDailyCollectorSummaryUseCase } from '../../application/usecases/GetDailyCollectorSummaryUseCase';
import { GetDailyPaymentMethodReportUseCase } from '../../application/usecases/GetDailyPaymentMethodReportUseCase';
import { GetFullBreakdownReportUseCase } from '../../application/usecases/GetFullBreakdownReportUseCase';

// ── Context type (Dependency Inversion: depends on use-case abstractions) ────
interface EntryDataContextType {
  getDailyGroupedReport: GetDailyGroupedReportUseCase;
  getDailyCollectorSummary: GetDailyCollectorSummaryUseCase;
  getDailyPaymentMethodReport: GetDailyPaymentMethodReportUseCase;
  getFullBreakdownReport: GetFullBreakdownReportUseCase;
}

const EntryDataContext = createContext<EntryDataContextType | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export const EntryDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  // Single repository instance shared across all use cases (DIP)
  const repository = new EntryDataRepositoryImpl();

  const value: EntryDataContextType = {
    getDailyGroupedReport: new GetDailyGroupedReportUseCase(repository),
    getDailyCollectorSummary: new GetDailyCollectorSummaryUseCase(repository),
    getDailyPaymentMethodReport: new GetDailyPaymentMethodReportUseCase(
      repository
    ),
    getFullBreakdownReport: new GetFullBreakdownReportUseCase(repository)
  };

  return (
    <EntryDataContext.Provider value={value}>
      {children}
    </EntryDataContext.Provider>
  );
};

// ── Hook guard ────────────────────────────────────────────────────────────────
export const useEntryDataContext = (): EntryDataContextType => {
  const context = useContext(EntryDataContext);
  if (!context) {
    throw new Error(
      'useEntryDataContext must be used within an EntryDataProvider'
    );
  }
  return context;
};
