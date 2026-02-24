import React, { createContext, useContext, type ReactNode } from 'react';
import { GetReadingInfoUseCase } from '../../application/usecases/GetReadingInfoUseCase';
import { GetReadingHistoryUseCase } from '../../application/usecases/GetReadingHistoryUseCase';
import { CreateReadingUseCase } from '../../application/usecases/CreateReadingUseCase';
import { ReadingInfoRepositoryImpl } from '../../infrastructure/repositories/ReadingInfoRepositoryImpl';
import { ReadingHistoryRepositoryImpl } from '../../infrastructure/repositories/ReadingHistoryRepositoryImpl';
import { CreateReadingRepositoryImpl } from '../../infrastructure/repositories/CreateReadingRepositoryImpl';

interface ReadingsContextType {
  getReadingInfoUseCase: GetReadingInfoUseCase;
  getReadingHistoryUseCase: GetReadingHistoryUseCase;
  createReadingUseCase: CreateReadingUseCase;
}

const ReadingsContext = createContext<ReadingsContextType | null>(null);

export const ReadingsProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const readingInfoRepository = new ReadingInfoRepositoryImpl();
  const readingHistoryRepository = new ReadingHistoryRepositoryImpl();
  const createReadingRepository = new CreateReadingRepositoryImpl();

  const getReadingInfoUseCase = new GetReadingInfoUseCase(
    readingInfoRepository
  );
  const getReadingHistoryUseCase = new GetReadingHistoryUseCase(
    readingHistoryRepository
  );
  const createReadingUseCase = new CreateReadingUseCase(
    createReadingRepository
  );

  const value = {
    getReadingInfoUseCase,
    getReadingHistoryUseCase,
    createReadingUseCase
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
