import React, { createContext, useContext, type ReactNode } from 'react';
import { GetReadingNoveltyUseCase } from '../../application/usecases/GetReadingNoveltyUseCase';
import { GetReadingNoveltyRepositoryImpl } from '../../infrastructure/repositories/GetReadingNoveltyRepositoryImpl';

interface ReadingNoveltyContextType {
  getReadingNoveltyUseCase: GetReadingNoveltyUseCase;
}

const ReadingNoveltyContext = createContext<ReadingNoveltyContextType | null>(
  null
);

export const ReadingNoveltyProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  // Repositories
  const getReadingNoveltyRepository = new GetReadingNoveltyRepositoryImpl();

  // Use Cases
  const getReadingNoveltyUseCase = new GetReadingNoveltyUseCase(
    getReadingNoveltyRepository
  );

  const value = {
    getReadingNoveltyUseCase
  };

  return (
    <ReadingNoveltyContext.Provider value={value}>
      {children}
    </ReadingNoveltyContext.Provider>
  );
};

export const useReadingNoveltyContext = () => {
  const context = useContext(ReadingNoveltyContext);
  if (!context) {
    throw new Error(
      'useReadingNoveltyContext must be used within ReadingNoveltyProvider'
    );
  }
  return context;
};
