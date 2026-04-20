import React, { createContext, useContext } from 'react';
import { AgreementsRepositoryImpl } from '../../../infrastructure/repositories/AgreementsRepositoryImpl';
import { GetAgreementInstallmentDetailsUseCase } from '../../../application/usecases/agreements/GetAgreementInstallmentDetails';
import { GetAgreementsKpiUseCase } from '../../../application/usecases/agreements/GetAgreementsKpi';
import { GetAgreementsKpiCustomerUseCase } from '../../../application/usecases/agreements/GetAgreementsKpiCustomer';
import { GetCitizenSummaryUseCase } from '../../../application/usecases/agreements/GetCitizenSummary';
import { GetCollectorPerformanceUseCase } from '../../../application/usecases/agreements/GetCollectorPerformance';
import { GetDebtorsWithRiskUseCase } from '../../../application/usecases/agreements/GetDebtorsWithRisk';
import { GetMonthlyCollectionSummaryUseCase } from '../../../application/usecases/agreements/GetMonthlyCollectionSummary';
import { GetPaymentMethodSummaryUseCase } from '../../../application/usecases/agreements/GetPaymentMethodSummary';

interface AgreementsContextType {
  getAgreementInstallmentDetails: GetAgreementInstallmentDetailsUseCase;
  getAgreementsKpi: GetAgreementsKpiUseCase;
  getAgreementsKpiCustomer: GetAgreementsKpiCustomerUseCase;
  getCitizenSummary: GetCitizenSummaryUseCase;
  getCollectorPerformance: GetCollectorPerformanceUseCase;
  getDebtorsWithRisk: GetDebtorsWithRiskUseCase;
  getMonthlyCollectionSummary: GetMonthlyCollectionSummaryUseCase;
  getPaymentMethodSummary: GetPaymentMethodSummaryUseCase;
}

const AgreementsContext = createContext<AgreementsContextType | null>(null);

export const AgreementsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const repository = new AgreementsRepositoryImpl();

  const value: AgreementsContextType = {
    getAgreementInstallmentDetails: new GetAgreementInstallmentDetailsUseCase(
      repository
    ),
    getAgreementsKpi: new GetAgreementsKpiUseCase(repository),
    getAgreementsKpiCustomer: new GetAgreementsKpiCustomerUseCase(repository),
    getCitizenSummary: new GetCitizenSummaryUseCase(repository),
    getCollectorPerformance: new GetCollectorPerformanceUseCase(repository),
    getDebtorsWithRisk: new GetDebtorsWithRiskUseCase(repository),
    getMonthlyCollectionSummary: new GetMonthlyCollectionSummaryUseCase(
      repository
    ),
    getPaymentMethodSummary: new GetPaymentMethodSummaryUseCase(repository)
  };

  return (
    <AgreementsContext.Provider value={value}>
      {children}
    </AgreementsContext.Provider>
  );
};

export const useAgreementsContext = (): AgreementsContextType => {
  const context = useContext(AgreementsContext);
  if (!context) {
    throw new Error(
      'useAgreementsContext must be used within an AgreementsProvider'
    );
  }
  return context;
};
