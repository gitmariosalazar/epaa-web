import { GetTrashRateAuditRowUseCase } from '../../application/usecases/GetTrashRateAuditRowUseCase';
import { GetMonthlySummaryRowUseCase } from '../../application/usecases/GetMonthlySummaryRowUseCase';
import { GetMissingValorRowUseCase } from '../../application/usecases/GetMissingValorRowUseCase';
import { GetCreditNoteRowUseCase } from '../../application/usecases/GetCreditNoteRowUseCase';
import { GetTopDebtorRowUseCase } from '../../application/usecases/GetTopDebtorRowUseCase';
import { GetTrashDashboardKpiUseCase } from '../../application/usecases/GetTrashDashboardKpiUseCase';
import { GetClientTrashDetailRowUseCase } from '../../application/usecases/GetClientTrashDetailRowUse';
import { createContext, useContext } from 'react';
import { TrashRateRepositoryImpl } from '../../infrastructure/repositories/TrashRateRepositoryImpl';

interface TrashRateReportContextType {
  getTrashRateAuditReport: GetTrashRateAuditRowUseCase;
  getMonthlySummaryReport: GetMonthlySummaryRowUseCase;
  getMissingValorBills: GetMissingValorRowUseCase;
  getActiveCreditNotes: GetCreditNoteRowUseCase;
  getClientDetailSearch: GetClientTrashDetailRowUseCase;
  getTopDebtorReport: GetTopDebtorRowUseCase;
  getDashboardKPITrashRate: GetTrashDashboardKpiUseCase;
}

const TrashRateReportContext = createContext<TrashRateReportContextType | null>(
  null
);

export const TrashRateReportProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const trashRateReportRepository = new TrashRateRepositoryImpl();

  const value: TrashRateReportContextType = {
    getTrashRateAuditReport: new GetTrashRateAuditRowUseCase(
      trashRateReportRepository
    ),
    getMonthlySummaryReport: new GetMonthlySummaryRowUseCase(
      trashRateReportRepository
    ),
    getMissingValorBills: new GetMissingValorRowUseCase(
      trashRateReportRepository
    ),
    getActiveCreditNotes: new GetCreditNoteRowUseCase(
      trashRateReportRepository
    ),
    getClientDetailSearch: new GetClientTrashDetailRowUseCase(
      trashRateReportRepository
    ),
    getTopDebtorReport: new GetTopDebtorRowUseCase(trashRateReportRepository),
    getDashboardKPITrashRate: new GetTrashDashboardKpiUseCase(
      trashRateReportRepository
    )
  };

  return (
    <TrashRateReportContext.Provider value={value}>
      {children}
    </TrashRateReportContext.Provider>
  );
};

export const useTrashRateReportContext = () => {
  const context = useContext(TrashRateReportContext);
  if (!context) {
    throw new Error(
      'useTrashRateReportContext must be used within a TrashRateReportProvider'
    );
  }
  return context;
};
