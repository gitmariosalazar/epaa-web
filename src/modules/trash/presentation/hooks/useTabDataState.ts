import { useState, useCallback } from 'react';

/**
 * useTabDataState<T>
 *
 * SRP: Encapsula el ciclo de vida completo de los datos de UN tab:
 *   - data[]         → resultado del último fetch exitoso
 *   - isLoading      → en vuelo
 *   - error          → mensaje de error o null
 *   - hasFetched     → true una vez que el usuario presionó Consultar (éxito o error)
 *
 * OCP: El tipo genérico T permite reutilizar este hook para cualquier tab
 *      sin modificarlo.
 *
 * DIP: No conoce ningún caso de uso concreto; recibe la función fetch como
 *      parámetro (inyección de dependencia).
 */
export interface TabDataState<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
  /** Ejecuta el fetcher y actualiza el estado interno */
  fetch: (fetcher: () => Promise<T[]>) => Promise<void>;
  /** Limpia datos, error y resetea hasFetched a false */
  clear: () => void;
  clearError: () => void;
}

export function useTabDataState<T>(): TabDataState<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetch = useCallback(async (fetcher: () => Promise<T[]>) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      setHasFetched(true);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : err ? String(err) : 'Error desconocido';
      setError(msg);
      setData([]);
      setHasFetched(true); // hasFetched=true incluso en error (el usuario ya consultó)
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Resetea completamente el estado del tab (al cambiar de tab principal) */
  const clear = useCallback(() => {
    setData([]);
    setError(null);
    setHasFetched(false);
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { data, isLoading, error, hasFetched, fetch, clear, clearError };
}
