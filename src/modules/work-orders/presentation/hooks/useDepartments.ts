/**
 * useDepartments — Hook para cargar y gestionar departamentos y tipos de trabajo
 *
 * CLEAN ARCHITECTURE (Presentation Hook):
 *   - Encapsula la llamada a GetAllDepartmentsUseCase.
 *   - Expone estado reactivo (departments, isLoading, error, reload).
 *
 * SOLID:
 *   - SRP: Solo se encarga de la obtención y estado del catálogo de departamentos y tipos de trabajo.
 *   - DIP: Recibe opcionalmente GetAllDepartmentsUseCase o lo instancia a través del repositorio abstracto.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DepartmentResponse } from '../../domain/schemas/dto/response/work-orders.get.response';
import { GetAllDepartmentsUseCase } from '../../application/usecases/GetAllDepartmentsUseCase';
import { ProcessWorkOrderRepositoryImpl } from '../../infrastructure/repositories/ProcessWorkOrderRepositoryImpl';

export interface UseDepartmentsReturn {
  departments: DepartmentResponse[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export const useDepartments = (customUseCase?: GetAllDepartmentsUseCase): UseDepartmentsReturn => {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useCase = useMemo(() => {
    if (customUseCase) return customUseCase;
    const repository = new ProcessWorkOrderRepositoryImpl();
    return new GetAllDepartmentsUseCase(repository);
  }, [customUseCase]);

  const loadDepartments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await useCase.execute();
      setDepartments(data);
    } catch (err: any) {
      console.error('[useDepartments] Error loading departments:', err);
      setError(err?.message || 'Error al cargar los departamentos y tipos de trabajo.');
    } finally {
      setIsLoading(false);
    }
  }, [useCase]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  return {
    departments,
    isLoading,
    error,
    reload: loadDepartments,
  };
};
