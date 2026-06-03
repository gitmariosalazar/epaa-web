import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Solicitud } from '../../domain/models/Solicitud';
import { SolicitudRepositoryImpl } from '../../infrastructure/repositories/SolicitudRepositoryImpl';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { GetExpedientsByAnalistaUseCase } from '../../application/usecases/GetExpedientsByAnalistaUseCase';

interface SolicitudesContextType {
  solicitudes: Solicitud[];
  isLoading: boolean;
  error: string | null;
  loadSolicitudes: (analistaId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const SolicitudesContext = createContext<SolicitudesContextType | undefined>(undefined);

export const SolicitudesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuth();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new SolicitudRepositoryImpl(), []);
  const getExpedientesUseCase = useMemo(
    () => new GetExpedientsByAnalistaUseCase(repository),
    [repository]
  );

  const loadSolicitudes = useCallback(
    async (analistaId: string) => {
      if (!analistaId) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getExpedientesUseCase.execute(analistaId);
        setSolicitudes(data);
      } catch (err: any) {
        console.error('Error loading expedientes in context:', err);
        setError(err.message || 'Error al cargar las solicitudes del servidor.');
      } finally {
        setIsLoading(false);
      }
    },
    [getExpedientesUseCase]
  );

  const refresh = useCallback(async () => {
    if (authUser?.userId) {
      await loadSolicitudes(authUser.userId);
    }
  }, [authUser?.userId, loadSolicitudes]);

  // Load automatically when analista ID changes
  React.useEffect(() => {
    if (authUser?.userId) {
      loadSolicitudes(authUser.userId);
    } else {
      setSolicitudes([]);
    }
  }, [authUser?.userId, loadSolicitudes]);

  const value = useMemo(
    () => ({
      solicitudes,
      isLoading,
      error,
      loadSolicitudes,
      refresh
    }),
    [solicitudes, isLoading, error, loadSolicitudes, refresh]
  );

  return (
    <SolicitudesContext.Provider value={value}>
      {children}
    </SolicitudesContext.Provider>
  );
};

export const useSolicitudesContext = () => {
  const context = useContext(SolicitudesContext);
  if (!context) {
    throw new Error('useSolicitudesContext must be used within a SolicitudesProvider');
  }
  return context;
};
