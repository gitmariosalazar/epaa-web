import { useCallback, useState } from 'react';
import { useGetPropertiesContext } from '../context/GetPropertiesContext';
import type { Property, PropertyByType } from '../../domain/models/Property';

export const useProperties = () => {
  const context = useGetPropertiesContext();

  const [loadingCount, setLoadingCount] = useState(0);
  const loading = loadingCount > 0;
  const [error, setError] = useState<Error | null>(null);

  const [property, setProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesByType, setPropertiesByType] = useState<PropertyByType[]>(
    []
  );

  const clearError = useCallback(() => setError(null), []);
  const clearProperties = useCallback(() => setProperties([]), []);
  const clearPropertiesByType = useCallback(() => setPropertiesByType([]), []);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
      setLoadingCount((prev) => prev + 1);
      setError(null);
      try {
        return await fn();
      } catch (err) {
        setError(err as Error);
        return undefined;
      } finally {
        setLoadingCount((prev) => Math.max(0, prev - 1));
      }
    },
    []
  );

  const fetchPropertyById = useCallback(
    async (propertyCadastralKey: string) => {
      return await withLoading(async () => {
        const result =
          await context.getPropertyById.execute(propertyCadastralKey);
        setProperty(result);
        return result;
      });
    },
    [context.getPropertyById, withLoading]
  );

  const fetchAllProperties = useCallback(
    async (limit: number, offset: number, append = false) => {
      return await withLoading(async () => {
        const result = await context.findAllProperties.execute(limit, offset);
        setProperties((prev) => (append ? [...prev, ...result] : result));
        return result;
      });
    },
    [context.findAllProperties, withLoading]
  );

  const fetchPropertiesByOwner = useCallback(
    async (clientId: string, limit: number, offset: number, append = false) => {
      return await withLoading(async () => {
        const result = await context.findPropertiesByOwner.execute(
          clientId,
          limit,
          offset
        );
        setProperties((prev) => (append ? [...prev, ...result] : result));
        return result;
      });
    },
    [context.findPropertiesByOwner, withLoading]
  );

  const fetchPropertiesByType = useCallback(async () => {
    return await withLoading(async () => {
      const result = await context.findPropertiesByType.execute();
      setPropertiesByType(result);
      return result;
    });
  }, [context.findPropertiesByType, withLoading]);

  return {
    property,
    properties,
    propertiesByType,
    loading,
    error,
    clearError,
    clearProperties,
    clearPropertiesByType,
    fetchPropertyById,
    fetchAllProperties,
    fetchPropertiesByOwner,
    fetchPropertiesByType
  };
};
