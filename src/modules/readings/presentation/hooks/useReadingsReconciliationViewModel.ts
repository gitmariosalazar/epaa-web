import { useState, useCallback } from 'react';
import { useReadingsReconciliation } from './useReadingsReconciliation';
import type { 
  DetalleAuditoriaResponse, 
  AuditoriaFiltroType, 
  ResumenAuditoriaResponse,
  ReconciliationSummary,
  DuplicateReconciliationRecord,
  ReconciliationMismatchRecord
} from '../../domain/models/lecturas-reconciliation';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

export type ReconciliationTab = 'migration' | 'kpis' | 'discrepancies' | 'basic-summary' | 'duplicates' | 'basic-mismatches';

export const useReadingsReconciliationViewModel = () => {
  const repo = useReadingsReconciliation();
  
  const [activeTab, setActiveTab] = useState<ReconciliationTab>('migration');
  
  // State for Month Selection
  const [selectedMonth, setSelectedMonth] = useState<string>(dateService.getCurrentMonthString());
  
  // State for Migration Tab
  const [migrationResult, setMigrationResult] = useState<any | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isComparing, setIsComparing] = useState(false);

  // State for KPIs Tab
  const [kpiData, setKpiData] = useState<ResumenAuditoriaResponse | null>(null);
  
  // State for Discrepancies Tab
  const [discrepancyFilter, setDiscrepancyFilter] = useState<AuditoriaFiltroType>('TODOS');
  const [discrepanciesData, setDiscrepanciesData] = useState<DetalleAuditoriaResponse | null>(null);

  // State for Basic Summary Tab
  const [basicSummaryData, setBasicSummaryData] = useState<ReconciliationSummary | null>(null);

  // State for Duplicates Tab
  const [duplicatesData, setDuplicatesData] = useState<DuplicateReconciliationRecord[]>([]);

  // State for Basic Mismatches Tab
  const [basicMismatchesData, setBasicMismatchesData] = useState<ReconciliationMismatchRecord[]>([]);

  // Common fetching status
  const isLoading = repo.isLoading || isMigrating || isComparing;
  const error = repo.error;

  const handleTabChange = useCallback((tab: ReconciliationTab) => {
    setActiveTab(tab);
    repo.clearError();
  }, [repo]);

  // Actions for Migration Tab
  const handleMigrate = async () => {
    setIsMigrating(true);
    const result = await repo.migrateLecturas([selectedMonth]);
    if (result) {
      setMigrationResult(result);
      await fetchAllData();
    }
    setIsMigrating(false);
  };

  const handleCompare = async () => {
    setIsComparing(true);
    const result = await repo.compareLecturas([selectedMonth]);
    if (result) setMigrationResult(result);
    setIsComparing(false);
  };

  // Actions for KPIs Tab
  const fetchKpis = useCallback(async () => {
    if (!selectedMonth) return;
    // Assuming selectedMonth is in YYYY-MM format
    const [year, monthNum] = selectedMonth.split('-');
    const result = await repo.getKpis({
      anio: year,
      mesTexto: monthNum, // Depends on how backend expects it, but backend accepts mesLectura string 
      mesLectura: selectedMonth
    });
    if (result) setKpiData(result);
  }, [selectedMonth, repo]);

  // Actions for Discrepancies Tab
  const fetchDiscrepancies = useCallback(async () => {
    if (!selectedMonth) return;
    const [year, monthNum] = selectedMonth.split('-');
    const result = await repo.getDiscrepanciesDetail({
      periodo: {
        anio: year,
        mesTexto: monthNum,
        mesLectura: selectedMonth
      },
      tipo_filtro: discrepancyFilter
    });
    if (result) setDiscrepanciesData(result);
  }, [selectedMonth, discrepancyFilter, repo]);

  // Actions for Basic Summary Tab
  const fetchBasicSummary = useCallback(async () => {
    if (!selectedMonth) return;
    const [year, monthNum] = selectedMonth.split('-');
    const result = await repo.getSummary({
      anio: year,
      mesTexto: monthNum,
      mesLectura: selectedMonth
    });
    if (result) setBasicSummaryData(result);
  }, [selectedMonth, repo]);

  // Actions for Duplicates Tab
  const fetchDuplicates = useCallback(async () => {
    if (!selectedMonth) return;
    const [year, monthNum] = selectedMonth.split('-');
    const result = await repo.getDuplicates({
      anio: year,
      mesTexto: monthNum,
      mesLectura: selectedMonth
    });
    if (result) setDuplicatesData(result);
  }, [selectedMonth, repo]);

  // Actions for Basic Mismatches Tab
  const fetchBasicMismatches = useCallback(async () => {
    if (!selectedMonth) return;
    const [year, monthNum] = selectedMonth.split('-');
    const result = await repo.getMismatches({
      anio: year,
      mesTexto: monthNum,
      mesLectura: selectedMonth
    });
    if (result) setBasicMismatchesData(result);
  }, [selectedMonth, repo]);

  // Fetch all data for the selected month
  const fetchAllData = useCallback(async () => {
    await Promise.allSettled([
      fetchKpis(),
      fetchDiscrepancies(),
      fetchBasicSummary(),
      fetchDuplicates(),
      fetchBasicMismatches()
    ]);
  }, [fetchKpis, fetchDiscrepancies, fetchBasicSummary, fetchDuplicates, fetchBasicMismatches]);


  // Automatic fetches based on tab switching
  const handleFetchData = useCallback(() => {
    if (activeTab === 'kpis') { fetchKpis(); fetchBasicSummary(); }
    if (activeTab === 'discrepancies') fetchDiscrepancies();
    if (activeTab === 'basic-summary') fetchBasicSummary();
    if (activeTab === 'duplicates') fetchDuplicates();
    if (activeTab === 'basic-mismatches') fetchBasicMismatches();
  }, [activeTab, fetchKpis, fetchDiscrepancies, fetchBasicSummary, fetchDuplicates, fetchBasicMismatches]);

  return {
    activeTab,
    handleTabChange,
    
    selectedMonth,
    setSelectedMonth,
    
    migrationResult,
    handleMigrate,
    handleCompare,
    isMigrating,
    isComparing,
    
    kpiData,
    fetchKpis,
    
    discrepancyFilter,
    setDiscrepancyFilter,
    discrepanciesData,
    fetchDiscrepancies,

    basicSummaryData,
    fetchBasicSummary,

    duplicatesData,
    fetchDuplicates,

    basicMismatchesData,
    fetchBasicMismatches,
    
    handleFetchData,
    fetchAllData,
    
    isLoading,
    error,
    clearError: repo.clearError
  };
};
