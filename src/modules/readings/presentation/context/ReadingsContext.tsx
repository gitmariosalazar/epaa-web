import React, { createContext, useContext, type ReactNode } from 'react';
import { GetReadingInfoUseCase } from '../../application/usecases/GetReadingInfoUseCase';
import { GetReadingHistoryUseCase } from '../../application/usecases/GetReadingHistoryUseCase';
import { CreateReadingUseCase } from '../../application/usecases/CreateReadingUseCase';
import { ReadingInfoRepositoryImpl } from '../../infrastructure/repositories/ReadingInfoRepositoryImpl';
import { ReadingHistoryRepositoryImpl } from '../../infrastructure/repositories/ReadingHistoryRepositoryImpl';
import { CreateReadingRepositoryImpl } from '../../infrastructure/repositories/CreateReadingRepositoryImpl';
import { PendingReadingConnectionUseCase } from '../../application/usecases/PendingReadingConnectionUseCase';
import { PendingReadingConnectionRepositoryImpl } from '../../infrastructure/repositories/PendingReadingConnectionRepositoryImpl';
import { TakenReadingConnectionUseCase } from '../../application/usecases/TakenReadingConnectionUseCase';
import { TakenReadingConnectionRepositoryImpl } from '../../infrastructure/repositories/TakenReadingConnectionRepositoryImpl';
import { ReadingImagesUseCase } from '../../application/usecases/ReadingImagesUseCase';
import { ReadingImagesRepositoryImpl } from '../../infrastructure/repositories/ReadingImagesRepositoryImpl';
import { UpdateReadingUseCase } from '../../application/usecases/UpdateReadingUseCase';
import { UpdateReadingRepositoryImpl } from '../../infrastructure/repositories/UpdateReadingRepositoryImpl';
// ── Audit ────────────────────────────────────────────────────────────────────
import { ReadingAuditRepositoryImpl } from '../../infrastructure/repositories/ReadingAuditRepositoryImpl';
import { InitializeMonthlyAuditUseCase } from '../../application/usecases/audit/InitializeMonthlyAuditUseCase';
import { GetAuditByMonthUseCase } from '../../application/usecases/audit/GetAuditByMonthUseCase';
import { GetAuditBySectorAndMonthUseCase } from '../../application/usecases/audit/GetAuditBySectorAndMonthUseCase';
import { CloseAuditSectorUseCase } from '../../application/usecases/audit/CloseAuditSectorUseCase';
import { GetAuditHistoryBySectorUseCase } from '../../application/usecases/audit/GetAuditHistoryBySectorUseCase';

interface ReadingsContextType {
  getReadingInfoUseCase: GetReadingInfoUseCase;
  getReadingHistoryUseCase: GetReadingHistoryUseCase;
  createReadingUseCase: CreateReadingUseCase;
  getPendingReadingsByMonthUseCase: PendingReadingConnectionUseCase;
  getTakenReadingEstimatesOrAverageUseCase: TakenReadingConnectionUseCase;
  getTakenReadingsByMonthUseCase: TakenReadingConnectionUseCase;
  readingImagesUseCase: ReadingImagesUseCase;
  updateReadingUseCase: UpdateReadingUseCase;
  // Audit use cases
  initializeMonthlyAuditUseCase: InitializeMonthlyAuditUseCase;
  getAuditByMonthUseCase: GetAuditByMonthUseCase;
  getAuditBySectorAndMonthUseCase: GetAuditBySectorAndMonthUseCase;
  closeAuditSectorUseCase: CloseAuditSectorUseCase;
  getAuditHistoryBySectorUseCase: GetAuditHistoryBySectorUseCase;
}

const ReadingsContext = createContext<ReadingsContextType | null>(null);

export const ReadingsProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  // Repositories
  const readingInfoRepository = new ReadingInfoRepositoryImpl();
  const readingHistoryRepository = new ReadingHistoryRepositoryImpl();
  const createReadingRepository = new CreateReadingRepositoryImpl();
  const pendingReadingConnectionRepository =
    new PendingReadingConnectionRepositoryImpl();
  const takenReadingConnectionRepository =
    new TakenReadingConnectionRepositoryImpl();
  const readingImagesRepository = new ReadingImagesRepositoryImpl();
  const updateReadingRepository = new UpdateReadingRepositoryImpl();
  const readingAuditRepository = new ReadingAuditRepositoryImpl();

  // Use Cases
  const getTakenReadingEstimatesOrAverageUseCase =
    new TakenReadingConnectionUseCase(takenReadingConnectionRepository);
  const getTakenReadingsByMonthUseCase = new TakenReadingConnectionUseCase(
    takenReadingConnectionRepository
  );
  const getReadingInfoUseCase = new GetReadingInfoUseCase(
    readingInfoRepository
  );
  const getReadingHistoryUseCase = new GetReadingHistoryUseCase(
    readingHistoryRepository
  );
  const createReadingUseCase = new CreateReadingUseCase(
    createReadingRepository
  );
  const getPendingReadingsByMonthUseCase = new PendingReadingConnectionUseCase(
    pendingReadingConnectionRepository
  );
  const readingImagesUseCase = new ReadingImagesUseCase(
    readingImagesRepository
  );
  const updateReadingUseCase = new UpdateReadingUseCase(
    updateReadingRepository
  );
  // Audit use cases
  const initializeMonthlyAuditUseCase = new InitializeMonthlyAuditUseCase(
    readingAuditRepository
  );
  const getAuditByMonthUseCase = new GetAuditByMonthUseCase(
    readingAuditRepository
  );
  const getAuditBySectorAndMonthUseCase = new GetAuditBySectorAndMonthUseCase(
    readingAuditRepository
  );
  const closeAuditSectorUseCase = new CloseAuditSectorUseCase(
    readingAuditRepository
  );
  const getAuditHistoryBySectorUseCase = new GetAuditHistoryBySectorUseCase(
    readingAuditRepository
  );

  const value = {
    getReadingInfoUseCase,
    getReadingHistoryUseCase,
    createReadingUseCase,
    getPendingReadingsByMonthUseCase,
    getTakenReadingEstimatesOrAverageUseCase,
    getTakenReadingsByMonthUseCase,
    readingImagesUseCase,
    updateReadingUseCase,
    // Audit
    initializeMonthlyAuditUseCase,
    getAuditByMonthUseCase,
    getAuditBySectorAndMonthUseCase,
    closeAuditSectorUseCase,
    getAuditHistoryBySectorUseCase
  };

  return (
    <ReadingsContext.Provider value={value}>
      {children}
    </ReadingsContext.Provider>
  );
};

export const useReadingsContext = () => {
  const context = useContext(ReadingsContext);
  if (!context) {
    throw new Error('useReadingsContext must be used within ReadingsProvider');
  }
  return context;
};
