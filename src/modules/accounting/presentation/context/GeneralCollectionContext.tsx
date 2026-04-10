import React, { createContext, useContext } from 'react';
import { GeneralCollectionRepositoryImpl } from '../../infrastructure/repositories/GeneralCollectionRepositoryImpl';
import { GetGeneralCollectionKPIUseCase } from '../../application/usecases/general-collection/GetGeneralCollectionKPIUseCase';
import { GetGeneralCollectionReportUseCase } from '../../application/usecases/general-collection/GetGeneralCollectionReportUseCase';
import { GetGeneralDailyCollectionGroupedReportUseCase } from '../../application/usecases/general-collection/GetGeneralDailyCollectionGroupedReportUseCase';
import { GetGeneralYearlyCollectionGroupedReportUseCase } from '../../application/usecases/general-collection/GetGeneralYearlyCollectionGroupedReportUseCase';
import { GetGeneralMonthlyCollectionGroupedReportUseCase } from '../../application/usecases/general-collection/GetGeneralMonthlyCollectionGroupedReportUseCase';
import { GetGeneralYearlyCollectionKPIUseCase } from '../../application/usecases/general-collection/GetGeneralYearlyCollectionKPIUseCase';
import { GetGeneralMonthlyCollectionKPIUseCase } from '../../application/usecases/general-collection/GetGeneralMonthlyCollectionKPIUseCase';

interface GeneralCollectionContextType {
  getGeneralCollectionKPI: GetGeneralCollectionKPIUseCase;
  getGeneralCollectionReport: GetGeneralCollectionReportUseCase;
  getGeneralDailyCollectionGroupedReport: GetGeneralDailyCollectionGroupedReportUseCase;
  getGeneralYearlyCollectionGroupedReport: GetGeneralYearlyCollectionGroupedReportUseCase;
  getGeneralMonthlyCollectionGroupedReport: GetGeneralMonthlyCollectionGroupedReportUseCase;
  getGeneralYearlyCollectionKPI: GetGeneralYearlyCollectionKPIUseCase;
  getGeneralMonthlyCollectionKPI: GetGeneralMonthlyCollectionKPIUseCase;
}

const GeneralCollectionContext = createContext<GeneralCollectionContextType | null>(null);

export const GeneralCollectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const repository = new GeneralCollectionRepositoryImpl();

  const value: GeneralCollectionContextType = {
    getGeneralCollectionKPI: new GetGeneralCollectionKPIUseCase(repository),
    getGeneralCollectionReport: new GetGeneralCollectionReportUseCase(repository),
    getGeneralDailyCollectionGroupedReport: new GetGeneralDailyCollectionGroupedReportUseCase(repository),
    getGeneralYearlyCollectionGroupedReport: new GetGeneralYearlyCollectionGroupedReportUseCase(repository),
    getGeneralMonthlyCollectionGroupedReport: new GetGeneralMonthlyCollectionGroupedReportUseCase(repository),
    getGeneralYearlyCollectionKPI: new GetGeneralYearlyCollectionKPIUseCase(repository),
    getGeneralMonthlyCollectionKPI: new GetGeneralMonthlyCollectionKPIUseCase(repository)
  };

  return (
    <GeneralCollectionContext.Provider value={value}>
      {children}
    </GeneralCollectionContext.Provider>
  );
};

export const useGeneralCollectionContext = (): GeneralCollectionContextType => {
  const context = useContext(GeneralCollectionContext);
  if (!context) {
    throw new Error(
      'useGeneralCollectionContext must be used within a GeneralCollectionProvider'
    );
  }
  return context;
};
