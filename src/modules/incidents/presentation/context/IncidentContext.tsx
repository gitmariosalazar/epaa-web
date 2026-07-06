import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { IncidentResponse } from '../../domain/schemas/dtos/response/incident.response';
import type { IncidentCategoryResponse } from '../../domain/schemas/dtos/response/incident-category-type.response';
import type { CreateIncidentRequest } from '../../domain/schemas/dtos/request/create-incident.request';
import type { ResolveIncidentRequest } from '../../domain/schemas/dtos/request/resolve-incident.request';
import { IncidentRepositoryImpl } from '../../infrastructure/repositories/IncidentRepositoryImpl';
import { CreateIncidentUseCase } from '../../application/usecases/commands/CreateIncidentUseCase';
import { ResolveIncidentUseCase } from '../../application/usecases/commands/ResolveIncidentUseCase';
import { FindIncidentCategoriesUseCase } from '../../application/usecases/queries/FindIncidentCategoriesUseCase';
import { FindIncidentsByConnectionUseCase } from '../../application/usecases/queries/FindIncidentsByConnectionUseCase';
import { FindActiveIncidentsByConnectionUseCase } from '../../application/usecases/queries/FindActiveIncidentsByConnectionUseCase';
import { SearchIncidentsUseCase } from '../../application/usecases/queries/SearchIncidentsUseCase';
import type { ApiResponse } from '@/shared/infrastructure/api/response/ApiResponse';
import type { IncidentDetailRowResponse } from '../../domain/schemas/dtos/response/view_incident.response';

interface IncidentContextType {
  incidents: IncidentDetailRowResponse[];
  categories: IncidentCategoryResponse[];
  isLoading: boolean;
  error: string | null;
  loadIncidents: (filters?: {
    connectionId?: string | null;
    status?: string | null;
    priority?: string | null;
    categoryId?: number | null;
    sector?: string | null;
    reference?: string | null;
    reportDate?: Date | null;
  }) => Promise<void>;
  loadCategories: () => Promise<void>;
  createIncident: (request: CreateIncidentRequest) => Promise<ApiResponse<IncidentResponse> | null>;
  resolveIncident: (request: ResolveIncidentRequest) => Promise<ApiResponse<IncidentResponse> | null>;
  loadByConnection: (connectionId: string) => Promise<void>;
  loadActiveByConnection: (connectionId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<IncidentDetailRowResponse[]>([]);
  const [categories, setCategories] = useState<IncidentCategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new IncidentRepositoryImpl(), []);

  const createIncidentUseCase = useMemo(() => new CreateIncidentUseCase(repository), [repository]);
  const resolveIncidentUseCase = useMemo(() => new ResolveIncidentUseCase(repository), [repository]);
  const findIncidentCategoriesUseCase = useMemo(() => new FindIncidentCategoriesUseCase(repository), [repository]);
  const findIncidentsByConnectionUseCase = useMemo(() => new FindIncidentsByConnectionUseCase(repository), [repository]);
  const findActiveIncidentsByConnectionUseCase = useMemo(() => new FindActiveIncidentsByConnectionUseCase(repository), [repository]);
  const searchIncidentsUseCase = useMemo(() => new SearchIncidentsUseCase(repository), [repository]);

  const loadIncidents = useCallback(
    async (filters: {
      connectionId?: string | null;
      status?: string | null;
      priority?: string | null;
      categoryId?: number | null;
      sector?: string | null;
      reference?: string | null;
      reportDate?: Date | null;
    } = {}) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await searchIncidentsUseCase.execute(filters);
        setIncidents(response.data || []);
      } catch (err: any) {
        console.error('Error loading incidents:', err);
        setError(err.message || 'Error al cargar los incidentes del servidor.');
      } finally {
        setIsLoading(false);
      }
    },
    [searchIncidentsUseCase]
  );

  const loadCategories = useCallback(async () => {
    try {
      const response = await findIncidentCategoriesUseCase.execute();
      setCategories(response.data || []);
    } catch (err: any) {
      console.error('Error loading categories:', err);
    }
  }, [findIncidentCategoriesUseCase]);

  const loadByConnection = useCallback(
    async (connectionId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await findIncidentsByConnectionUseCase.execute(connectionId);
        setIncidents(response.data || []);
      } catch (err: any) {
        console.error('Error loading incidents by connection:', err);
        setError(err.message || 'Error al cargar los incidentes de la acometida.');
      } finally {
        setIsLoading(false);
      }
    },
    [findIncidentsByConnectionUseCase]
  );

  /**
   * loadActiveByConnection — expone FindActiveIncidentsByConnectionUseCase.
   * Carga solo los incidentes activos (estado ≠ RESUELTO) de una acometida.
   */
  const loadActiveByConnection = useCallback(
    async (connectionId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const activeIncidents =
          await findActiveIncidentsByConnectionUseCase.execute(connectionId);
        setIncidents(activeIncidents);
      } catch (err: any) {
        console.error('Error loading active incidents by connection:', err);
        setError(err.message || 'Error al cargar los incidentes activos.');
      } finally {
        setIsLoading(false);
      }
    },
    [findActiveIncidentsByConnectionUseCase]
  );

  const createIncident = useCallback(
    async (request: CreateIncidentRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await createIncidentUseCase.execute(request);
        await loadIncidents(); // Refresh list after creation
        return response;
      } catch (err: any) {
        console.error('Error creating incident:', err);
        setError(err.message || 'Error al reportar el incidente.');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [createIncidentUseCase, loadIncidents]
  );

  const resolveIncident = useCallback(
    async (request: ResolveIncidentRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await resolveIncidentUseCase.execute(request);
        await loadIncidents(); // Refresh list after resolution
        return response;
      } catch (err: any) {
        console.error('Error resolving incident:', err);
        setError(err.message || 'Error al resolver el incidente.');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resolveIncidentUseCase, loadIncidents]
  );

  const refresh = useCallback(async () => {
    await loadIncidents();
    await loadCategories();
  }, [loadIncidents, loadCategories]);

  // Initial categories load
  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const value = useMemo(
    () => ({
      incidents,
      categories,
      isLoading,
      error,
      loadIncidents,
      loadCategories,
      createIncident,
      resolveIncident,
      loadByConnection,
      loadActiveByConnection,
      refresh,
    }),
    [incidents, categories, isLoading, error, loadIncidents, loadCategories, createIncident, resolveIncident, loadByConnection, loadActiveByConnection, refresh]
  );

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidentContext = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidentContext must be used within an IncidentProvider');
  }
  return context;
};
