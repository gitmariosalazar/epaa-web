import { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import type {
  PhotoResponse,
  ConnectionWithoutProperty
} from '../../domain/models/Connection';
import { ConnectionContext } from '../context/ConnectionContext';
import { FindAllConnectionsWithPropertyUseCase } from '../../application/usecases/FindAllConnectionsWithPropertyUseCase';
import { GetConnectionsUseCase } from '../../application/usecases/GetConnectionsUseCase';
import { ConnectionRepositoryImpl } from '../../infrastructure/repositories/ConnectionRepositoryImpl';

export interface UseConnectionPhotosOptions {
  /**
   * Clave catastral o ID de la acometida para buscar las fotos.
   */
  cadastralKey?: string | null;
  /**
   * ID alternativo de la acometida.
   */
  connectionId?: string | null;
  /**
   * Fotos de fachada iniciales (si ya existen en memoria).
   */
  initialPhotosFacade?: PhotoResponse[] | null;
  /**
   * Fotos de medidor iniciales (si ya existen en memoria).
   */
  initialPhotosMeter?: PhotoResponse[] | null;
  /**
   * Indica si se deben buscar automáticamente al inicializar o cambiar de acometida.
   * Default: true.
   */
  autoFetch?: boolean;
}

export interface UseConnectionPhotosReturn {
  photosFacade: PhotoResponse[];
  photosMeter: PhotoResponse[];
  totalPhotos: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lightboxFacadeIndex: number | null;
  setLightboxFacadeIndex: (index: number | null) => void;
  lightboxMeterIndex: number | null;
  setLightboxMeterIndex: (index: number | null) => void;
  closeLightboxes: () => void;
}

/**
 * Helper to match a connection record from search results.
 */
function isTargetMatch(
  c: ConnectionWithoutProperty,
  targetId: string,
  targetAccount?: string | number | null,
  targetSector?: string | number | null
): boolean {
  const cleanTarget = targetId.trim().toLowerCase();
  const cleanConnId = (c.connectionId || '').trim().toLowerCase();
  const cleanCadastral = (c.connectionCadastralKey || '').trim().toLowerCase();
  const cleanAccount = c.connectionAccount
    ? String(c.connectionAccount).trim()
    : '';
  const cleanSector = c.connectionSector
    ? String(c.connectionSector).trim()
    : '';
  const targetAccStr =
    targetAccount != null ? String(targetAccount).trim() : '';
  const targetSectorStr =
    targetSector != null ? String(targetSector).trim() : '';

  if (cleanConnId === cleanTarget || cleanCadastral === cleanTarget) {
    return true;
  }

  if (
    targetAccStr.length > 0 &&
    cleanAccount === targetAccStr &&
    targetSectorStr.length > 0 &&
    cleanSector === targetSectorStr
  ) {
    return true;
  }

  return false;
}

/**
 * useConnectionPhotos
 *
 * Custom hook adhering to Clean Architecture & SOLID:
 * - Single Responsibility Principle (SRP): Encapsulates fetching, matching,
 *   and lightbox state management for connection evidence photos.
 * - Dependency Inversion Principle (DIP): Resolves use cases via React Context
 *   or falls back to repository instantiation if outside provider.
 */
export function useConnectionPhotos({
  cadastralKey,
  connectionId,
  initialPhotosFacade,
  initialPhotosMeter,
  autoFetch = true
}: UseConnectionPhotosOptions): UseConnectionPhotosReturn {
  const context = useContext(ConnectionContext);

  const fallbackUseCases = useMemo(() => {
    const repository = new ConnectionRepositoryImpl();
    return {
      findAllUseCase: new FindAllConnectionsWithPropertyUseCase(repository),
      getConnUseCase: new GetConnectionsUseCase(repository)
    };
  }, []);

  const findAllUseCase =
    context?.findAllConnectionsWithPropertyUseCase ||
    fallbackUseCases.findAllUseCase;
  const getConnUseCase =
    context?.getConnectionsUseCase || fallbackUseCases.getConnUseCase;

  const [photosFacade, setPhotosFacade] = useState<PhotoResponse[]>(() => {
    return initialPhotosFacade || [];
  });
  const [photosMeter, setPhotosMeter] = useState<PhotoResponse[]>(() => {
    return initialPhotosMeter || [];
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Lightbox navigation states
  const [lightboxFacadeIndex, setLightboxFacadeIndex] = useState<number | null>(
    null
  );
  const [lightboxMeterIndex, setLightboxMeterIndex] = useState<number | null>(
    null
  );

  const closeLightboxes = useCallback(() => {
    setLightboxFacadeIndex(null);
    setLightboxMeterIndex(null);
  }, []);

  // Update when initialPhotos change
  useEffect(() => {
    if (initialPhotosFacade) {
      setPhotosFacade(initialPhotosFacade);
    }
    if (initialPhotosMeter) {
      setPhotosMeter(initialPhotosMeter);
    }
  }, [initialPhotosFacade, initialPhotosMeter]);

  const fetchPhotos = useCallback(async () => {
    // If pre-loaded photos were explicitly supplied, no network call required
    if (
      (initialPhotosFacade && initialPhotosFacade.length > 0) ||
      (initialPhotosMeter && initialPhotosMeter.length > 0)
    ) {
      return;
    }

    const targetKey = (cadastralKey || connectionId || '').trim();
    if (!targetKey) {
      setPhotosFacade([]);
      setPhotosMeter([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let foundData: ConnectionWithoutProperty | null = null;

      // 1. Direct query with targetKey
      try {
        const results = await findAllUseCase.execute({
          limit: 50,
          offset: 0,
          query: targetKey
        });
        if (results && results.length > 0) {
          foundData = results.find((c) => isTargetMatch(c, targetKey)) || null;
        }
      } catch {
        // Fallback search will execute below
      }

      // 2. Fallback query if not directly matched
      if (!foundData) {
        try {
          const paginated = await getConnUseCase.execute(50, 0, targetKey);
          if (paginated && paginated.length > 0) {
            const matchedBasic =
              paginated.find(
                (c) =>
                  c.connectionId === targetKey ||
                  c.connectionCadastralKey === targetKey ||
                  String(c.connectionAccount) === targetKey
              ) || paginated[0];

            const fallbackSearchTerms = [
              matchedBasic.connectionMeterNumber,
              matchedBasic.connectionCadastralKey,
              matchedBasic.connectionAccount
                ? String(matchedBasic.connectionAccount)
                : null,
              matchedBasic.clientId
            ].filter(
              (term): term is string =>
                typeof term === 'string' && term.trim().length > 0
            );

            for (const term of fallbackSearchTerms) {
              try {
                const fallbackResults = await findAllUseCase.execute({
                  limit: 100,
                  offset: 0,
                  query: term
                });
                if (fallbackResults && fallbackResults.length > 0) {
                  const match = fallbackResults.find((c) =>
                    isTargetMatch(
                      c,
                      matchedBasic.connectionId,
                      matchedBasic.connectionAccount,
                      matchedBasic.connectionSector
                    )
                  );
                  if (match) {
                    foundData = match;
                    break;
                  }
                }
              } catch {
                // Try next fallback search term
              }
            }
          }
        } catch {
          // Fallback search failed
        }
      }

      if (foundData) {
        setPhotosFacade(foundData.photoFacade || []);
        setPhotosMeter(foundData.photoMeter || []);
      } else {
        setPhotosFacade([]);
        setPhotosMeter([]);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al cargar las evidencias fotográficas de la acometida.';
      setError(msg);
      console.error('Error fetching connection photos:', err);
    } finally {
      setLoading(false);
    }
  }, [
    cadastralKey,
    connectionId,
    initialPhotosFacade,
    initialPhotosMeter,
    findAllUseCase,
    getConnUseCase
  ]);

  useEffect(() => {
    if (autoFetch) {
      fetchPhotos();
    }
  }, [autoFetch, fetchPhotos]);

  const totalPhotos = photosFacade.length + photosMeter.length;

  return {
    photosFacade,
    photosMeter,
    totalPhotos,
    loading,
    error,
    refetch: fetchPhotos,
    lightboxFacadeIndex,
    setLightboxFacadeIndex,
    lightboxMeterIndex,
    setLightboxMeterIndex,
    closeLightboxes
  };
}
