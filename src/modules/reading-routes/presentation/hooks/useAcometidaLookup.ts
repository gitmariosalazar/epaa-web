import { useState, useCallback, useRef } from 'react';
import { ConnectionRepositoryImpl } from '@/modules/connections/service-connections/infrastructure/repositories/ConnectionRepositoryImpl';
import { decodeEWKBPoint, type Coordinate } from '@/shared/utils/geoUtils';

export interface AcometidaInfo {
  id: string;
  cadastralKey: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  meterNumber: string;
  sector?: number;
  rateName: string;
  status: string;
  coords: Coordinate | null;
  raw: any;
}

export interface UseAcometidaLookupReturn {
  acometida: AcometidaInfo | null;
  isLoading: boolean;
  error: string | null;
  searchAcometida: (searchQuery: string) => Promise<AcometidaInfo | null>;
  clearAcometida: () => void;
}

/**
 * useAcometidaLookup
 *
 * Custom hook following Clean Architecture & SOLID:
 * - Single Responsibility Principle (SRP): Encapsulates looking up connection details
 *   and extracting their spatial coordinates and sector.
 * - Dependency Inversion Principle (DIP): Relies on ConnectionRepository abstraction.
 */
export function useAcometidaLookup(): UseAcometidaLookupReturn {
  const [acometida, setAcometida] = useState<AcometidaInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const repositoryRef = useRef(new ConnectionRepositoryImpl());
  const lookupRequestIdRef = useRef<number>(0);

  const searchAcometida = useCallback(
    async (searchQuery: string): Promise<AcometidaInfo | null> => {
      const clean = searchQuery.trim();
      const currentReqId = ++lookupRequestIdRef.current;

      if (!clean) {
        setAcometida(null);
        setError(null);
        setIsLoading(false);
        return null;
      }

      // Immediately clear previous acometida data when a search starts
      setIsLoading(true);
      setError(null);
      setAcometida(null);

      try {
        const repo = repositoryRef.current;
        let foundData: any = null;

        // 1. Primary lookup: findConnectionAndPropertyByCadastralKeyOrCardId
        try {
          const results =
            await repo.findConnectionAndPropertyByCadastralKeyOrCardId(clean);
          if (results && results.length > 0) {
            foundData =
              results.find(
                (c) =>
                  (c.connectionId || '').toLowerCase() ===
                    clean.toLowerCase() ||
                  (c.connectionCadastralKey || '').toLowerCase() ===
                    clean.toLowerCase() ||
                  String(c.connectionAccount || '') === clean
              ) || results[0];
          }
        } catch {
          // Fallback search below
        }

        // 2. Secondary lookup: findAllConnectionsWithProperty
        if (!foundData) {
          try {
            const results = await repo.findAllConnectionsWithProperty({
              limit: 10,
              offset: 0,
              query: clean
            });
            if (results && results.length > 0) {
              foundData =
                results.find(
                  (c) =>
                    (c.connectionId || '').toLowerCase() ===
                      clean.toLowerCase() ||
                    (c.connectionCadastralKey || '').toLowerCase() ===
                      clean.toLowerCase() ||
                    String(c.connectionAccount || '') === clean
                ) || results[0];
            }
          } catch {
            // Fallback search below
          }
        }

        // 3. Fallback lookup: getConnections basic
        if (!foundData) {
          try {
            const basic = await repo.getConnections(10, 0, clean);
            if (basic && basic.length > 0) {
              foundData =
                basic.find(
                  (c) =>
                    (c.connectionId || '').toLowerCase() ===
                      clean.toLowerCase() ||
                    (c.connectionCadastralKey || '').toLowerCase() ===
                      clean.toLowerCase() ||
                    String(c.connectionAccount || '') === clean
                ) || basic[0];
            }
          } catch {
            // Not found
          }
        }

        if (foundData) {
          // Extract coordinates
          let coords: Coordinate | null = null;
          if (foundData.connectionCoordinates) {
            coords = decodeEWKBPoint(foundData.connectionCoordinates);
          }
          if (!coords && foundData.latitude && foundData.longitude) {
            const lat = Number(foundData.latitude);
            const lng = Number(foundData.longitude);
            if (!isNaN(lat) && !isNaN(lng) && !(lat === 0 && lng === 0)) {
              coords = { lat, lng };
            }
          }

          // Extract client name
          let clientName = 'Sin cliente asignado';
          if (foundData.person) {
            const name =
              `${foundData.person.firstName || ''} ${foundData.person.lastName || ''}`.trim();
            if (name) clientName = name;
          } else if (foundData.company) {
            const name =
              foundData.company.businessName ||
              foundData.company.commercialName;
            if (name) clientName = name;
          } else if (foundData.clientName) {
            clientName = foundData.clientName;
          }

          const sectorNum = Number(
            foundData.connectionSector || foundData.sector || foundData.zoneId
          );

          const info: AcometidaInfo = {
            id: foundData.connectionId || clean,
            cadastralKey:
              foundData.connectionCadastralKey ||
              foundData.connectionId ||
              clean,
            clientId:
              foundData.person?.personId || foundData.company?.ruc || '',
            clientName,
            clientAddress:
              foundData.connectionAddress ||
              foundData.clientAddress ||
              foundData.person?.address ||
              foundData.company?.address ||
              '—',
            meterNumber: foundData.connectionMeterNumber || '—',
            sector: !isNaN(sectorNum) && sectorNum > 0 ? sectorNum : undefined,
            rateName: foundData.connectionRateName || 'Agua Potable',
            status: foundData.connectionStatus || 'ACTIVA',
            coords,
            raw: foundData
          };

          if (currentReqId !== lookupRequestIdRef.current) return null;
          setAcometida(info);
          return info;
        } else {
          if (currentReqId !== lookupRequestIdRef.current) return null;
          setAcometida(null);
          return null;
        }
      } catch (err: unknown) {
        if (currentReqId !== lookupRequestIdRef.current) return null;
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setAcometida(null);
        return null;
      } finally {
        if (currentReqId === lookupRequestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  const clearAcometida = useCallback(() => {
    lookupRequestIdRef.current++;
    setAcometida(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    acometida,
    isLoading,
    error,
    searchAcometida,
    clearAcometida
  };
}
