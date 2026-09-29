import { useState, useCallback } from 'react';
import { GetScadaTelemetryUseCase } from '../../application/usecases/GetScadaTelemetryUseCase';
import { NetworkOperationsRepositoryImpl } from '../../infrastructure/repositories/NetworkOperationsRepositoryImpl';
import type { ScadaTelemetryResponse } from '../../domain/models/ScadaTelemetry';

export const useScadaTelemetryViewModel = () => {
  const [scadaData, setScadaData] = useState<ScadaTelemetryResponse[]>([]);
  const [loadingScada, setLoadingScada] = useState<boolean>(false);
  const [errorScada, setErrorScada] = useState<string | null>(null);

  const fetchScadaData = useCallback(async () => {
    setLoadingScada(true);
    setErrorScada(null);
    try {
      const repository = new NetworkOperationsRepositoryImpl();
      const useCase = new GetScadaTelemetryUseCase(repository);
      const data = await useCase.execute();
      setScadaData(data || []);
    } catch (err) {
      setErrorScada('Failed to fetch SCADA telemetry data.');
      console.error(err);
    } finally {
      setLoadingScada(false);
    }
  }, []);

  return {
    scadaData,
    loadingScada,
    errorScada,
    fetchScadaData,
  };
};
