import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { StateHistoryRepository } from '../../domain/repositories/StateHistoryRepository';
import { StateHistoryRepositoryImpl } from '../../infrastructure/repositories/StateHistoryRepositoryImpl';
import type { StateCatalogItem } from '../../domain/models/StateCatalog';
import type { StateSummaryItem } from '../../domain/models/StateSummary';

// Use Cases
import { ChangeConnectionStateUseCase } from '../../application/usecases/ChangeConnectionStateUseCase';
import { BulkChangeConnectionStateUseCase } from '../../application/usecases/BulkChangeConnectionStateUseCase';
import { RevertStateHistoryUseCase } from '../../application/usecases/RevertStateHistoryUseCase';
import { GetConnectionHistoryUseCase } from '../../application/usecases/GetConnectionHistoryUseCase';
import { GetCurrentConnectionStateUseCase } from '../../application/usecases/GetCurrentConnectionStateUseCase';
import { GetStateHistoryByIdUseCase } from '../../application/usecases/GetStateHistoryByIdUseCase';
import { GetConnectionsByStateUseCase } from '../../application/usecases/GetConnectionsByStateUseCase';
import { GetStateCatalogUseCase } from '../../application/usecases/GetStateCatalogUseCase';
import { GetStateCatalogByIdUseCase } from '../../application/usecases/GetStateCatalogByIdUseCase';
import { GetStateSummaryUseCase } from '../../application/usecases/GetStateSummaryUseCase';
import { FilterStateHistoryUseCase } from '../../application/usecases/FilterStateHistoryUseCase';
import { GetAllowedTransitionsUseCase } from '../../application/usecases/GetAllowedTransitionsUseCase';
import { GetReversibleHistoryUseCase } from '../../application/usecases/GetReversibleHistoryUseCase';
import { GetStateEventsGeoJSONUseCase } from '../../application/usecases/GetStateEventsGeoJSONUseCase';

export interface StateHistoryContextValue {
  repository: StateHistoryRepository;
  useCases: {
    changeConnectionStateUseCase: ChangeConnectionStateUseCase;
    bulkChangeConnectionStateUseCase: BulkChangeConnectionStateUseCase;
    revertStateHistoryUseCase: RevertStateHistoryUseCase;
    getConnectionHistoryUseCase: GetConnectionHistoryUseCase;
    getCurrentConnectionStateUseCase: GetCurrentConnectionStateUseCase;
    getStateHistoryByIdUseCase: GetStateHistoryByIdUseCase;
    getConnectionsByStateUseCase: GetConnectionsByStateUseCase;
    getStateCatalogUseCase: GetStateCatalogUseCase;
    getStateCatalogByIdUseCase: GetStateCatalogByIdUseCase;
    getStateSummaryUseCase: GetStateSummaryUseCase;
    filterStateHistoryUseCase: FilterStateHistoryUseCase;
    getAllowedTransitionsUseCase: GetAllowedTransitionsUseCase;
    getReversibleHistoryUseCase: GetReversibleHistoryUseCase;
    getStateEventsGeoJSONUseCase: GetStateEventsGeoJSONUseCase;
  };
  catalog: StateCatalogItem[];
  isLoadingCatalog: boolean;
  refreshCatalog: () => Promise<void>;
  summary: StateSummaryItem[];
  isLoadingSummary: boolean;
  refreshSummary: () => Promise<void>;
}

const StateHistoryContext = createContext<StateHistoryContextValue | undefined>(undefined);

// Singleton fallback para uso sin proveedor (resiliencia total)
const defaultRepository = new StateHistoryRepositoryImpl();
const defaultUseCases = {
  changeConnectionStateUseCase: new ChangeConnectionStateUseCase(defaultRepository),
  bulkChangeConnectionStateUseCase: new BulkChangeConnectionStateUseCase(defaultRepository),
  revertStateHistoryUseCase: new RevertStateHistoryUseCase(defaultRepository),
  getConnectionHistoryUseCase: new GetConnectionHistoryUseCase(defaultRepository),
  getCurrentConnectionStateUseCase: new GetCurrentConnectionStateUseCase(defaultRepository),
  getStateHistoryByIdUseCase: new GetStateHistoryByIdUseCase(defaultRepository),
  getConnectionsByStateUseCase: new GetConnectionsByStateUseCase(defaultRepository),
  getStateCatalogUseCase: new GetStateCatalogUseCase(defaultRepository),
  getStateCatalogByIdUseCase: new GetStateCatalogByIdUseCase(defaultRepository),
  getStateSummaryUseCase: new GetStateSummaryUseCase(defaultRepository),
  filterStateHistoryUseCase: new FilterStateHistoryUseCase(defaultRepository),
  getAllowedTransitionsUseCase: new GetAllowedTransitionsUseCase(defaultRepository),
  getReversibleHistoryUseCase: new GetReversibleHistoryUseCase(defaultRepository),
  getStateEventsGeoJSONUseCase: new GetStateEventsGeoJSONUseCase(defaultRepository)
};

const defaultContextValue: StateHistoryContextValue = {
  repository: defaultRepository,
  useCases: defaultUseCases,
  catalog: [],
  isLoadingCatalog: false,
  refreshCatalog: async () => {},
  summary: [],
  isLoadingSummary: false,
  refreshSummary: async () => {}
};

export interface StateHistoryProviderProps {
  children: React.ReactNode;
  repository?: StateHistoryRepository;
}

export const StateHistoryProvider: React.FC<StateHistoryProviderProps> = ({
  children,
  repository: customRepository
}) => {
  const repository = useMemo(
    () => customRepository || new StateHistoryRepositoryImpl(),
    [customRepository]
  );

  const useCases = useMemo(() => {
    return {
      changeConnectionStateUseCase: new ChangeConnectionStateUseCase(repository),
      bulkChangeConnectionStateUseCase: new BulkChangeConnectionStateUseCase(repository),
      revertStateHistoryUseCase: new RevertStateHistoryUseCase(repository),
      getConnectionHistoryUseCase: new GetConnectionHistoryUseCase(repository),
      getCurrentConnectionStateUseCase: new GetCurrentConnectionStateUseCase(repository),
      getStateHistoryByIdUseCase: new GetStateHistoryByIdUseCase(repository),
      getConnectionsByStateUseCase: new GetConnectionsByStateUseCase(repository),
      getStateCatalogUseCase: new GetStateCatalogUseCase(repository),
      getStateCatalogByIdUseCase: new GetStateCatalogByIdUseCase(repository),
      getStateSummaryUseCase: new GetStateSummaryUseCase(repository),
      filterStateHistoryUseCase: new FilterStateHistoryUseCase(repository),
      getAllowedTransitionsUseCase: new GetAllowedTransitionsUseCase(repository),
      getReversibleHistoryUseCase: new GetReversibleHistoryUseCase(repository),
      getStateEventsGeoJSONUseCase: new GetStateEventsGeoJSONUseCase(repository)
    };
  }, [repository]);

  const [catalog, setCatalog] = useState<StateCatalogItem[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);

  const [summary, setSummary] = useState<StateSummaryItem[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const refreshCatalog = async () => {
    setIsLoadingCatalog(true);
    try {
      const data = await useCases.getStateCatalogUseCase.execute();
      setCatalog(data);
    } catch (err) {
      console.error('Error fetching state catalog:', err);
    } finally {
      setIsLoadingCatalog(false);
    }
  };

  const refreshSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const data = await useCases.getStateSummaryUseCase.execute();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching state summary:', err);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    refreshCatalog();
  }, [useCases]);

  const contextValue = useMemo<StateHistoryContextValue>(
    () => ({
      repository,
      useCases,
      catalog,
      isLoadingCatalog,
      refreshCatalog,
      summary,
      isLoadingSummary,
      refreshSummary
    }),
    [repository, useCases, catalog, isLoadingCatalog, summary, isLoadingSummary]
  );

  return (
    <StateHistoryContext.Provider value={contextValue}>
      {children}
    </StateHistoryContext.Provider>
  );
};

export const useStateHistoryContext = (): StateHistoryContextValue => {
  const context = useContext(StateHistoryContext);
  return context || defaultContextValue;
};
