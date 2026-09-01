import { useState } from 'react';
import { useConnectionsContext } from '../context/ConnectionContext';
import type { ChangeMeterRequest } from '../../domain/models/MeterChange';

export const useChangeMeter = () => {
  const { changeMeterUseCase } = useConnectionsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeMeter = async (request: ChangeMeterRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await changeMeterUseCase.execute(request);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al cambiar el medidor');
      setIsLoading(false);
      return false;
    }
  };

  return {
    changeMeter,
    isLoading,
    error,
  };
};
