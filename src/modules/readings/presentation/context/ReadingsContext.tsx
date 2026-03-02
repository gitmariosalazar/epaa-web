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

interface ReadingsContextType {
  getReadingInfoUseCase: GetReadingInfoUseCase;
  getReadingHistoryUseCase: GetReadingHistoryUseCase;
  createReadingUseCase: CreateReadingUseCase;
  getPendingReadingsByMonthUseCase: PendingReadingConnectionUseCase;
  getTakenReadingEstimatesOrAverageUseCase: TakenReadingConnectionUseCase;
  getTakenReadingsByMonthUseCase: TakenReadingConnectionUseCase;
  readingImagesUseCase: ReadingImagesUseCase;
}

const ReadingsContext = createContext<ReadingsContextType | null>(null);

export const ReadingsProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const readingInfoRepository = new ReadingInfoRepositoryImpl();
  const readingHistoryRepository = new ReadingHistoryRepositoryImpl();
  const createReadingRepository = new CreateReadingRepositoryImpl();
  const pendingReadingConnectionRepository =
    new PendingReadingConnectionRepositoryImpl();
  const takenReadingConnectionRepository =
    new TakenReadingConnectionRepositoryImpl();
  const readingImagesRepository = new ReadingImagesRepositoryImpl();

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

  const value = {
    getReadingInfoUseCase,
    getReadingHistoryUseCase,
    createReadingUseCase,
    getPendingReadingsByMonthUseCase,
    getTakenReadingEstimatesOrAverageUseCase,
    getTakenReadingsByMonthUseCase,
    readingImagesUseCase
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
