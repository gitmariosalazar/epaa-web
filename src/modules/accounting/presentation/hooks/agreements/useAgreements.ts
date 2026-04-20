import { useState, useCallback } from 'react';
import { useAgreementsContext } from '../../context/agreements/AgreementsContext';
import type {
  AgreementKPIsResponse,
  AgreementInstallmentResponse,
  MonthlyCollectionSummary,
  Debtor,
  CollectorPerformance,
  PaymentMethodSummary,
  CitizenSummary
} from '../../../domain/models/Agreements';
import type { AgreementsParams } from '../../../domain/dto/params/AgreementsParams';
import type { DateRangeParams } from '../../../domain/dto/params/DataEntryParams';

export const useAgreements = () => {
  const context = useAgreementsContext();

  const [kpi, setKpi] = useState<AgreementKPIsResponse[]>([]);
  const [installments, setInstallments] = useState<
    AgreementInstallmentResponse[]
  >([]);
  const [monthlySummary, setMonthlySummary] = useState<
    MonthlyCollectionSummary[]
  >([]);
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [collectorPerformance, setCollectorPerformance] = useState<
    CollectorPerformance[]
  >([]);
  const [paymentMethodSummary, setPaymentMethodSummary] = useState<
    PaymentMethodSummary[]
  >([]);
  const [citizenSummary, setCitizenSummary] = useState<CitizenSummary[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKpi = useCallback(
    async (params: AgreementsParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await context.getAgreementsKpi.execute(params);
        setKpi(result || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch agreements KPI');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.getAgreementsKpi]
  );

  const fetchMonthlySummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await context.getMonthlyCollectionSummary.execute();
      setMonthlySummary(result || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch monthly collection summary');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [context.getMonthlyCollectionSummary]);

  const fetchDebtors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await context.getDebtorsWithRisk.execute();
      setDebtors(result || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch debtors');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [context.getDebtorsWithRisk]);

  const fetchCollectorPerformance = useCallback(
    async (params: DateRangeParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await context.getCollectorPerformance.execute(params);
        setCollectorPerformance(result || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch collector performance');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.getCollectorPerformance]
  );

  const fetchPaymentMethodSummary = useCallback(
    async (params: DateRangeParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await context.getPaymentMethodSummary.execute(params);
        setPaymentMethodSummary(result || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch payment method summary');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.getPaymentMethodSummary]
  );

  const fetchCitizenSummary = useCallback(
    async (params: DateRangeParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await context.getCitizenSummary.execute(params);
        setCitizenSummary(result || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch citizen summary');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.getCitizenSummary]
  );

  const fetchInstallments = useCallback(
    async (cardId: string, params: DateRangeParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await context.getAgreementInstallmentDetails.execute(
          cardId,
          params
        );
        setInstallments(result || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch installment details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [context.getAgreementInstallmentDetails]
  );

  return {
    kpi,
    installments,
    monthlySummary,
    debtors,
    collectorPerformance,
    paymentMethodSummary,
    citizenSummary,
    isLoading,
    error,
    fetchKpi,
    fetchMonthlySummary,
    fetchDebtors,
    fetchCollectorPerformance,
    fetchPaymentMethodSummary,
    fetchCitizenSummary,
    fetchInstallments
  };
};
