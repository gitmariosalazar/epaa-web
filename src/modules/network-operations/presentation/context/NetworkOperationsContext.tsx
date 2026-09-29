import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { GetNetworkMapGeoJsonUseCase } from '../../application/usecases/GetNetworkMapGeoJsonUseCase';
import { NetworkOperationsRepositoryImpl } from '../../infrastructure/repositories/NetworkOperationsRepositoryImpl';

interface NetworkOperationsContextType {
  getNetworkMapGeoJsonUseCase: GetNetworkMapGeoJsonUseCase;
}

const NetworkOperationsContext = createContext<NetworkOperationsContextType | null>(null);

export const NetworkOperationsProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const networkOperationsRepository = useMemo(
    () => new NetworkOperationsRepositoryImpl(),
    []
  );

  const value = useMemo<NetworkOperationsContextType>(() => {
    return {
      getNetworkMapGeoJsonUseCase: new GetNetworkMapGeoJsonUseCase(networkOperationsRepository)
    };
  }, [networkOperationsRepository]);

  return (
    <NetworkOperationsContext.Provider value={value}>
      {children}
    </NetworkOperationsContext.Provider>
  );
};

export const useNetworkOperationsContext = () => {
  const context = useContext(NetworkOperationsContext);
  if (!context) {
    throw new Error(
      'useNetworkOperationsContext must be used within NetworkOperationsProvider'
    );
  }
  return context;
};
