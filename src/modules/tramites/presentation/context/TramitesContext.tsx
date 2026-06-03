// ============================================================
// PRESENTATION — TramitesContext
// Dependency Injection via React Context (DIP at UI boundary).
// Components depend on this context, never on implementations.
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode
} from 'react';
import type { Tramite, SolicitudTramite } from '../../domain/models/Tramite';
import { TramiteRepositoryImpl } from '../../infrastructure/repositories/TramiteRepositoryImpl';
import { GetAllTramitesUseCase } from '../../application/usecases/GetAllTramitesUseCase';
import { GetTramiteByIdUseCase } from '../../application/usecases/GetTramiteByIdUseCase';
import { GetMisSolicitudesUseCase } from '../../application/usecases/GetMisSolicitudesUseCase';
import { SubmitSolicitudTramiteUseCase } from '../../application/usecases/SubmitSolicitudTramiteUseCase';
import type { SubmitSolicitudDTO } from '../../application/usecases/SubmitSolicitudTramiteUseCase';

interface TramitesContextType {
  tramites: Tramite[];
  misSolicitudes: SolicitudTramite[];
  isLoading: boolean;
  error: string | null;
  getTramiteById: (id: string) => Tramite | undefined;
  submitSolicitud: (dto: SubmitSolicitudDTO) => Promise<SolicitudTramite>;
  refreshSolicitudes: () => Promise<void>;
}

const TramitesContext = createContext<TramitesContextType | undefined>(undefined);

// ── DI: instantiate repository and inject into use cases ──
const repository = new TramiteRepositoryImpl();
const getAllUC = new GetAllTramitesUseCase(repository);
const getByIdUC = new GetTramiteByIdUseCase(repository);
const getMisUC = new GetMisSolicitudesUseCase(repository);
const submitUC = new SubmitSolicitudTramiteUseCase(repository);

export const TramitesProvider = ({ children }: { children: ReactNode }) => {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [misSolicitudes, setMisSolicitudes] = useState<SolicitudTramite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [all, mis] = await Promise.all([
          getAllUC.execute(),
          getMisUC.execute()
        ]);
        setTramites(all);
        setMisSolicitudes(mis);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error cargando trámites');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const getTramiteById = useCallback(
    (id: string) => tramites.find((t) => t.id === id),
    [tramites]
  );

  const submitSolicitud = useCallback(async (dto: SubmitSolicitudDTO) => {
    const result = await submitUC.execute(dto);
    setMisSolicitudes((prev) => [result, ...prev]);
    return result;
  }, []);

  const refreshSolicitudes = useCallback(async () => {
    const mis = await getMisUC.execute();
    setMisSolicitudes(mis);
  }, []);

  return (
    <TramitesContext.Provider
      value={{
        tramites,
        misSolicitudes,
        isLoading,
        error,
        getTramiteById,
        submitSolicitud,
        refreshSolicitudes
      }}
    >
      {children}
    </TramitesContext.Provider>
  );
};

export const useTramites = () => {
  const ctx = useContext(TramitesContext);
  if (!ctx) throw new Error('useTramites must be used within TramitesProvider');
  return ctx;
};

// For single tramite lookup without needing full context
export const useTramiteById = (id: string) => {
  const [tramite, setTramite] = useState<Tramite | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getByIdUC.execute(id).then((t) => {
      setTramite(t);
      setIsLoading(false);
    });
  }, [id]);

  return { tramite, isLoading };
};
