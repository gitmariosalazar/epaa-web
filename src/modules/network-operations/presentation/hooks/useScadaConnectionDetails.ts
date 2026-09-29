import { useState, useEffect } from 'react';
import { ConnectionRepositoryImpl } from '@/modules/connections/infrastructure/repositories/ConnectionRepositoryImpl';
import { FindConnectionWithPropertyByCadastralKeyUseCase } from '@/modules/connections/application/usecases/FindConnectionWithPropertyByCadastralKeyUseCase';
import type { ConnectionWithProperty } from '@/modules/connections/domain/models/Connection';

export const useScadaConnectionDetails = (cadastralKey?: string | null) => {
  const [connectionDetails, setConnectionDetails] = useState<ConnectionWithProperty | null>(null);
  const [loadingConnection, setLoadingConnection] = useState(false);
  const [errorConnection, setErrorConnection] = useState<string | null>(null);

  useEffect(() => {
    if (!cadastralKey) {
      setConnectionDetails(null);
      setErrorConnection(null);
      return;
    }

    const fetchConnection = async () => {
      setLoadingConnection(true);
      setErrorConnection(null);
      try {
        const repo = new ConnectionRepositoryImpl();
        const useCase = new FindConnectionWithPropertyByCadastralKeyUseCase(repo);
        const data = await useCase.execute(cadastralKey);
        setConnectionDetails(data);
      } catch (err) {
        console.error('Error fetching connection details:', err);
        setErrorConnection('No se pudieron obtener los detalles de la acometida.');
      } finally {
        setLoadingConnection(false);
      }
    };

    fetchConnection();
  }, [cadastralKey]);

  return { connectionDetails, loadingConnection, errorConnection };
};
