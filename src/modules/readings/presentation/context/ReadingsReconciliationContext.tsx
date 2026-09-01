import React, { createContext, useContext, type ReactNode } from 'react';
import { LecturasReconciliationRepositoryImpl } from '../../infrastructure/repositories/LecturasReconciliationRepositoryImpl';
import { CompareLecturasUseCase } from '../../application/usecases/readings-reconciliation.ts/compare-lecturas.usecase';
import { GetReconciliationDuplicatesUseCase } from '../../application/usecases/readings-reconciliation.ts/get-reconciliation-duplicates.usecase';
import { GetReconciliationMismatchesUseCase } from '../../application/usecases/readings-reconciliation.ts/get-reconciliation-mismatches.usecase';
import { GetReconciliationSummaryUseCase } from '../../application/usecases/readings-reconciliation.ts/get-reconciliation-summary.usecase';
import { GetDiscrepanciesDetailUseCase } from '../../application/usecases/readings-reconciliation.ts/getDiscrepanciesDetail.use-case';
import { GetReconciliationKpisUseCase } from '../../application/usecases/readings-reconciliation.ts/getReconciliationKpis.use-case';
import { MigrateLecturasUseCase } from '../../application/usecases/readings-reconciliation.ts/migrate-lecturas.usecase';

interface ReadingsReconciliationContextType {
  compareLecturasUseCase: CompareLecturasUseCase;
  getReconciliationDuplicatesUseCase: GetReconciliationDuplicatesUseCase;
  getReconciliationMismatchesUseCase: GetReconciliationMismatchesUseCase;
  getReconciliationSummaryUseCase: GetReconciliationSummaryUseCase;
  getDiscrepanciesDetailUseCase: GetDiscrepanciesDetailUseCase;
  getReconciliationKpisUseCase: GetReconciliationKpisUseCase;
  migrateLecturasUseCase: MigrateLecturasUseCase;
}

const ReadingsReconciliationContext = createContext<ReadingsReconciliationContextType | null>(null);

export const ReadingsReconciliationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const repository = new LecturasReconciliationRepositoryImpl();

  const value = {
    compareLecturasUseCase: new CompareLecturasUseCase(repository),
    getReconciliationDuplicatesUseCase: new GetReconciliationDuplicatesUseCase(repository),
    getReconciliationMismatchesUseCase: new GetReconciliationMismatchesUseCase(repository),
    getReconciliationSummaryUseCase: new GetReconciliationSummaryUseCase(repository),
    getDiscrepanciesDetailUseCase: new GetDiscrepanciesDetailUseCase(repository),
    getReconciliationKpisUseCase: new GetReconciliationKpisUseCase(repository),
    migrateLecturasUseCase: new MigrateLecturasUseCase(repository)
  };

  return (
    <ReadingsReconciliationContext.Provider value={value}>
      {children}
    </ReadingsReconciliationContext.Provider>
  );
};

export const useReadingsReconciliationContext = () => {
  const context = useContext(ReadingsReconciliationContext);
  if (!context) {
    throw new Error('useReadingsReconciliationContext must be used within ReadingsReconciliationProvider');
  }
  return context;
};
