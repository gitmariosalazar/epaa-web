import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef
} from 'react';
import {
  Compass,
  Search,
  PlusCircle,
  MapPin,
  Home,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useReadingRoutesContext } from '../../context/ReadingRoutesContext';
import type { RouteResolution } from '../../../domain/models/RouteResolution';
import type { RouteGeoJsonFeatureCollection } from '../../../domain/models/ReadingRoute';
import { RouteBadge } from '../common/RouteBadge';
import { notify } from '../../utils/notify';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import { Button } from '@/shared/presentation/components/Button/Button';
import { sectors as DEFAULT_SECTORS } from '@/shared/utils/listSectors';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Select } from '@/shared/presentation/components/Input/Select';
import { RiPieChart2Fill } from 'react-icons/ri';
import { TiLocationArrow } from 'react-icons/ti';
import { InputCadastralKey } from '@/shared/presentation/components/Input/InputCadastralKey';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { useAcometidaLookup } from '../../hooks/useAcometidaLookup';
import { SmartRouteResolverMap } from './SmartRouteResolverMap';
import './SmartRouteResolverModal.css';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';

interface SmartRouteResolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
  initialAcometidaId?: string;
  onSuccessInsert?: () => void;
}

/**
 * SmartRouteResolverModal
 *
 * Modal component following Clean Architecture & SOLID:
 * - Single Responsibility Principle (SRP): Modal coordinates the lookup of the acometida,
 *   spatial routing calculation (PostGIS Point-in-Polygon & KNN), and sequence insertion.
 * - Open-Closed Principle (OCP): Map visualization and connection lookup are isolated in
 *   reusable subcomponents/hooks without tight coupling.
 * - Dependency Inversion Principle (DIP): Uses useCases provided by ReadingRoutesContext
 *   and ConnectionRepository for data abstraction.
 */
export const SmartRouteResolverModal: React.FC<
  SmartRouteResolverModalProps
> = ({
  isOpen,
  onClose,
  initialLat,
  initialLng,
  initialAcometidaId,
  onSuccessInsert
}) => {
  const {
    resolveRouteForConnectionUseCase,
    insertConnectionIntoRouteUseCase,
    getRoutesGeoJsonUseCase
  } = useReadingRoutesContext();

  const [latitud, setLatitud] = useState<number>(
    initialLat ?? FALLBACK_CENTER_ANTONIO_ANTE.lat
  );
  const [longitud, setLongitud] = useState<number>(
    initialLng ?? FALLBACK_CENTER_ANTONIO_ANTE.lng
  );
  const [hasCoords, setHasCoords] = useState<boolean>(
    Boolean(
      initialLat !== undefined &&
      initialLng !== undefined &&
      !(initialLat === 0 && initialLng === 0)
    )
  );
  const [acometidaId, setAcometidaId] = useState<string>(
    initialAcometidaId ?? ''
  );
  const [sector, setSector] = useState<number | undefined>(undefined);

  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [resolutionResult, setResolutionResult] =
    useState<RouteResolution | null>(null);

  // Form fields for insertion
  const [ladoCalle, setLadoCalle] = useState<
    'IZQUIERDA' | 'DERECHA' | 'CENTRO'
  >('DERECHA');
  const [instruccionAcceso, setInstruccionAcceso] = useState<string>('');
  const [isInserting, setIsInserting] = useState<boolean>(false);

  // GeoJSON data for sector polygons
  const [geojsonData, setGeojsonData] =
    useState<RouteGeoJsonFeatureCollection | null>(null);
  const [isLoadingGeoJson, setIsLoadingGeoJson] = useState<boolean>(false);

  // Connection lookup hook
  const {
    acometida,
    isLoading: isLookingUpAcometida,
    searchAcometida,
    clearAcometida
  } = useAcometidaLookup();

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchRequestIdRef = useRef<number>(0);
  const resolveRequestIdRef = useRef<number>(0);
  const acometidaIdRef = useRef<string>(acometidaId);
  acometidaIdRef.current = acometidaId;

  // Sectores estándar (1-40)
  const sectors = useMemo(() => {
    const set = new Set<number>(DEFAULT_SECTORS.map((s) => s.id));
    return Array.from(set).sort((a, b) => a - b);
  }, []);

  // Clear all data from previous search immediately
  const clearPreviousSearch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    searchRequestIdRef.current++;
    resolveRequestIdRef.current++;

    clearAcometida();
    setResolutionResult(null);

    if (initialLat !== undefined && initialLng !== undefined) {
      setLatitud(initialLat);
      setLongitud(initialLng);
      setHasCoords(true);
    } else {
      setLatitud(FALLBACK_CENTER_ANTONIO_ANTE.lat);
      setLongitud(FALLBACK_CENTER_ANTONIO_ANTE.lng);
      setHasCoords(false);
    }

    setSector(undefined);
    setInstruccionAcceso('');
    setLadoCalle('DERECHA');
    setIsResolving(false);
  }, [clearAcometida, initialLat, initialLng]);

  // Core spatial resolution function (Pure GPS Proximity, OCP & SRP)
  const executeResolve = useCallback(
    async (lat: number, lng: number, targetAcometidaId?: string) => {
      if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return;
      setIsResolving(true);
      setResolutionResult(null);
      const resolveId = ++resolveRequestIdRef.current;
      try {
        // Pure GPS spatial resolution: do not force restrictive cadastral sector filter
        const result = await resolveRouteForConnectionUseCase.execute(
          lat,
          lng,
          undefined,
          targetAcometidaId || acometidaIdRef.current || undefined
        );
        if (resolveId !== resolveRequestIdRef.current) return;
        setResolutionResult(result);
        notify.success(
          `Ruta identificada: ${result.codigoRuta || result.codigo} (${result.nombreRuta || result.nombre || 'Dentro de Polígono SIG'})`
        );
      } catch (err: unknown) {
        if (resolveId !== resolveRequestIdRef.current) return;
        const msg = err instanceof Error ? err.message : String(err);
        console.warn('Error al resolver ruta espacial:', msg);
        notify.error('Error al resolver ruta espacial: ' + msg);
        setResolutionResult(null);
      } finally {
        if (resolveId === resolveRequestIdRef.current) {
          setIsResolving(false);
        }
      }
    },
    [resolveRouteForConnectionUseCase]
  );

  // Sync initial props
  useEffect(() => {
    if (initialLat !== undefined) {
      setLatitud(initialLat);
      setHasCoords(true);
    }
    if (initialLng !== undefined) {
      setLongitud(initialLng);
      setHasCoords(true);
    }
    if (initialAcometidaId !== undefined) {
      setAcometidaId(initialAcometidaId);
      if (initialAcometidaId.trim().length > 0) {
        clearPreviousSearch();
        const currentReqId = ++searchRequestIdRef.current;
        searchAcometida(initialAcometidaId).then((info) => {
          if (currentReqId !== searchRequestIdRef.current) return;
          if (info?.coords) {
            setLatitud(info.coords.lat);
            setLongitud(info.coords.lng);
            setHasCoords(true);
            void executeResolve(
              info.coords.lat,
              info.coords.lng,
              initialAcometidaId
            );
          } else if (info?.sector !== undefined) {
            setHasCoords(false);
            setSector(info.sector);
          }
        });
      }
    } else if (initialLat !== undefined && initialLng !== undefined) {
      setHasCoords(true);
      void executeResolve(initialLat, initialLng);
    }
  }, [
    initialLat,
    initialLng,
    initialAcometidaId,
    searchAcometida,
    executeResolve,
    clearPreviousSearch
  ]);

  // Clean up state when modal closes
  useEffect(() => {
    if (!isOpen) {
      clearPreviousSearch();
      setAcometidaId(initialAcometidaId ?? '');
    }
  }, [isOpen, clearPreviousSearch, initialAcometidaId]);

  // Load all active route polygons across the cantón (so full territory is available)
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsLoadingGeoJson(true);

    getRoutesGeoJsonUseCase
      .execute(undefined, true)
      .then((data) => {
        if (isMounted) {
          setGeojsonData(data);
        }
      })
      .catch((err) => {
        console.warn('Error al cargar capas GeoJSON de rutas:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingGeoJson(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, getRoutesGeoJsonUseCase]);

  // Handle acometida ID input change with debounce and automatic coordinate resolution
  const handleAcometidaIdChange = useCallback(
    (newId: string) => {
      setAcometidaId(newId);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // Always clear previous search data immediately when input changes
      clearPreviousSearch();

      const query = newId.trim();
      if (query.length >= 3) {
        debounceTimerRef.current = setTimeout(async () => {
          const currentReqId = ++searchRequestIdRef.current;
          const info = await searchAcometida(query);

          if (currentReqId !== searchRequestIdRef.current) return;

          if (info?.coords) {
            setLatitud(info.coords.lat);
            setLongitud(info.coords.lng);
            setHasCoords(true);
            notify.success(
              `Coordenadas asignadas automáticamente desde la acometida (${info.coords.lat.toFixed(5)}, ${info.coords.lng.toFixed(5)}).`
            );
            void executeResolve(info.coords.lat, info.coords.lng, query);
          } else if (info?.sector !== undefined) {
            setHasCoords(false);
            setSector(info.sector);
            notify.info(
              'La acometida no tiene coordenadas registradas. Puedes seleccionarlas haciendo clic en el mapa.'
            );
          } else if (info && !info.coords) {
            setHasCoords(false);
            notify.info(
              'La acometida no tiene coordenadas registradas. Puedes seleccionarlas haciendo clic en el mapa.'
            );
          }
        }, 500);
      }
    },
    [clearPreviousSearch, searchAcometida, executeResolve]
  );

  const handleManualSearch = useCallback(async () => {
    const query = acometidaId.trim();
    if (!query) {
      clearPreviousSearch();
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // Always clear previous search data immediately before searching
    clearPreviousSearch();

    const currentReqId = ++searchRequestIdRef.current;
    const info = await searchAcometida(query);

    if (currentReqId !== searchRequestIdRef.current) return;

    if (info) {
      if (info.coords) {
        setLatitud(info.coords.lat);
        setLongitud(info.coords.lng);
        setHasCoords(true);
        notify.success(
          `Coordenadas obtenidas de la acometida: ${info.coords.lat.toFixed(5)}, ${info.coords.lng.toFixed(5)}`
        );
        void executeResolve(info.coords.lat, info.coords.lng, query);
      } else {
        setHasCoords(false);
        notify.info(
          'La acometida no tiene coordenadas registradas. Puedes seleccionarlas haciendo clic en el mapa.'
        );
        if (info.sector !== undefined) {
          setSector(info.sector);
        }
      }
    } else {
      setHasCoords(false);
      notify.error('No se encontró información para la acometida indicada.');
    }
  }, [acometidaId, clearPreviousSearch, searchAcometida, executeResolve]);

  const handleCoordinatesChange = useCallback(
    (newLat: number, newLng: number) => {
      setLatitud(newLat);
      setLongitud(newLng);
      setHasCoords(true);
      void executeResolve(newLat, newLng, acometidaIdRef.current);
    },
    [executeResolve]
  );

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasCoords) {
      notify.info(
        'Por favor seleccione las coordenadas de la acometida haciendo clic en el mapa.'
      );
      return;
    }
    await executeResolve(latitud, longitud, acometidaIdRef.current);
  };

  const handleClose = useCallback(() => {
    clearPreviousSearch();
    setAcometidaId(initialAcometidaId ?? '');
    onClose();
  }, [clearPreviousSearch, initialAcometidaId, onClose]);

  const handleInsert = async () => {
    if (!resolutionResult || !acometidaId) {
      notify.error(
        'Debe especificar un ID de acometida para insertarla en la ruta.'
      );
      return;
    }

    setIsInserting(true);
    try {
      const targetId = resolutionResult.rutaId || resolutionResult.idRuta;
      const res = await insertConnectionIntoRouteUseCase.execute({
        idRuta: targetId,
        acometidaId,
        ordenSugerido: resolutionResult.ordenSugerido,
        ladoCalle,
        instruccionAcceso
      });

      notify.success(
        `Acometida insertada exitosamente en la Ruta #${resolutionResult.codigoRuta || resolutionResult.codigo} en la secuencia #${res.ordenSecuencia ?? ''}.`
      );
      if (onSuccessInsert) {
        onSuccessInsert();
      }
      handleClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      notify.error('Error al indexar acometida en ruta: ' + msg);
    } finally {
      setIsInserting(false);
    }
  };

  const getMethodBadgeClass = (method?: string) => {
    switch (method) {
      case 'POLIGONO':
      case 'POINT_IN_POLYGON':
        return 'method-polygon';
      case 'KNN':
      case 'NEAREST_CENTROID_KNN':
        return 'method-knn';
      default:
        return 'method-fallback';
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      icon={<Compass size={18} style={{ color: 'var(--accent)' }} />}
      title={
        <span className="smart-resolver-title">
          Enrutador Inteligente PostGIS para Nueva Acometida
        </span>
      }
      description="Determina automáticamente mediante Point-in-Polygon (ST_Contains) o K-Nearest Neighbors (KNN PostGIS) la ruta exacta y el orden secuencial óptimo para una acometida nueva."
      footer={
        <div className="smart-resolver-footer">
          <Button
            variant="dashed"
            size="xs"
            onClick={handleClose}
            disabled={isInserting}
            color="error"
            leftIcon={<IoIosCloseCircleOutline size={14} />}
          >
            Cerrar
          </Button>
          {resolutionResult && (
            <Button
              onClick={handleInsert}
              disabled={isInserting || !acometidaId}
              size="xs"
              variant="primary"
              leftIcon={
                <PlusCircle
                  size={14}
                  className={isInserting ? 'animate-spin' : ''}
                />
              }
            >
              {isInserting
                ? 'Indexando en Ruta...'
                : 'Insertar en Secuencia de Ruta'}
            </Button>
          )}
        </div>
      }
      size="full"
    >
      <div className="smart-resolver-layout">
        {/* Left Column: Connection Info & Form */}
        <div className="smart-resolver-left-panel custom-scrollbar">
          {/* Connection Search */}
          <div className="smart-resolver-field">
            <label className="smart-resolver-label">
              ID o Código Acometida:
              {isLookingUpAcometida && (
                <Loader2
                  size={13}
                  className="animate-spin"
                  color="var(--accent)"
                />
              )}
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <InputCadastralKey
                  type="text"
                  placeholder="Ej. 10-9823"
                  value={acometidaId}
                  onChange={handleAcometidaIdChange}
                  onBlur={handleManualSearch}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      void handleManualSearch();
                    }
                  }}
                  required
                  leftIcon={<Search size={14} />}
                  size="medium"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleManualSearch}
                disabled={isLookingUpAcometida || !acometidaId.trim()}
              >
                Buscar
              </Button>
            </div>
          </div>

          {/* Connection Information Summary Card */}
          {acometida && (
            <div className="smart-resolver-connection-card">
              <div className="smart-resolver-connection-header">
                <div className="smart-resolver-connection-icon">
                  <Home size={16} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <h4 className="smart-resolver-connection-title">
                    {acometida.cadastralKey || acometida.id}
                  </h4>
                  <span className="smart-resolver-connection-client">
                    {acometida.clientName} <strong>{acometida.clientId}</strong>
                  </span>
                </div>
                <div className="smart-georeferenced">
                  {acometida.coords ? (
                    <ColorChip
                      label="Georreferenciada"
                      color="#22c55e"
                      variant="soft"
                      size="xs"
                      icon={<CheckCircle2 size={12} />}
                    />
                  ) : (
                    <ColorChip
                      label="Sin coordenadas"
                      color="#f59e0b"
                      variant="soft"
                      size="xs"
                      icon={<AlertTriangle size={12} />}
                    />
                  )}
                </div>
              </div>

              <div className="smart-resolver-connection-grid">
                <div>
                  <span className="smart-resolver-card-label">Medidor:</span>
                  <span className="smart-resolver-card-val">
                    {acometida.meterNumber || '—'}
                  </span>
                </div>
                <div>
                  <span className="smart-resolver-card-label">Sector:</span>
                  <span className="smart-resolver-card-val">
                    {acometida.sector ? `Sector ${acometida.sector}` : '—'}
                  </span>
                </div>
                <div>
                  <span className="smart-resolver-card-label">Tarifa:</span>
                  <span className="smart-resolver-card-val">
                    {acometida.rateName || '—'}
                  </span>
                </div>
                <div>
                  <span className="smart-resolver-card-label">Estado:</span>
                  <span className="smart-resolver-card-val">
                    {acometida.status || 'ACTIVA'}
                  </span>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span className="smart-resolver-card-label">Dirección:</span>
                  <span className="smart-resolver-card-val">
                    {acometida.clientAddress || '—'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {acometidaId.trim() === '' && (
            <div className="smart-resolver-connection-card">
              <EmptyState
                message="Ingrese un ID de acometida"
                description="Por favor ingrese un ID de acometida. Ej: 12-345"
                variant="info"
              />
            </div>
          )}

          {(acometida === null || acometida === undefined) &&
            acometidaId.trim() !== '' && (
              <div className="smart-resolver-connection-card">
                <EmptyState
                  message="Acometida no encontrada"
                  description="No se pudo encontrar información de la acometida."
                  variant="error"
                />
              </div>
            )}

          {/* Form Fields */}
          <form
            onSubmit={handleResolve}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div className="smart-resolver-grid-4">
              <div className="smart-resolver-field">
                <label className="smart-resolver-label">
                  Sector (Opcional):
                </label>
                <Select
                  value={sector ?? ''}
                  disabled={true}
                  leftIcon={
                    sector ? (
                      <RiPieChart2Fill size={14} />
                    ) : (
                      <MapPin size={14} />
                    )
                  }
                  onChange={(e) =>
                    setSector(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                >
                  <option value="">Auto-detectar por coordenadas</option>
                  {sectors.map((sec) => (
                    <option key={sec} value={sec}>
                      Sector {sec}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="smart-resolver-grid">
              <div className="smart-resolver-field">
                <label className="smart-resolver-label">Latitud (WGS84):</label>
                <Input
                  type={hasCoords ? 'number' : 'text'}
                  step="any"
                  value={hasCoords ? latitud : ''}
                  placeholder={
                    isLookingUpAcometida
                      ? 'Buscando acometida...'
                      : 'Clic en mapa para asignar'
                  }
                  onChange={(e) => {
                    setLatitud(Number(e.target.value));
                    setHasCoords(true);
                  }}
                  required
                  disabled={true}
                  leftIcon={
                    <TiLocationArrow size={20} color="var(--warning)" />
                  }
                />
              </div>
              <div className="smart-resolver-field">
                <label className="smart-resolver-label">
                  Longitud (WGS84):
                </label>
                <Input
                  type={hasCoords ? 'number' : 'text'}
                  step="any"
                  value={hasCoords ? longitud : ''}
                  placeholder={
                    isLookingUpAcometida
                      ? 'Buscando acometida...'
                      : 'Clic en mapa para asignar'
                  }
                  onChange={(e) => {
                    setLongitud(Number(e.target.value));
                    setHasCoords(true);
                  }}
                  required
                  disabled={true}
                  leftIcon={
                    <TiLocationArrow
                      size={20}
                      color="var(--info)"
                      style={{ transform: 'rotate(90deg)' }}
                    />
                  }
                />
              </div>
            </div>
            <div
              className="smart-resolver-field"
              style={{ justifyContent: 'flex-end' }}
            >
              <Button
                type="submit"
                disabled={isResolving || !hasCoords}
                leftIcon={
                  <Search
                    size={14}
                    className={isResolving ? 'animate-spin' : ''}
                  />
                }
                variant="primary"
                fullWidth
              >
                {isResolving
                  ? 'Calculando en PostGIS...'
                  : 'Resolver Ruta Espacial'}
              </Button>
            </div>
          </form>

          {/* Result Card */}
          {resolutionResult && (
            <div className="smart-resolver-result">
              <div className="smart-resolver-result-header">
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.2rem'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        color: 'var(--accent)',
                        fontSize: '1.1rem'
                      }}
                    >
                      {resolutionResult.codigoRuta || resolutionResult.codigo}
                    </span>
                    <RouteBadge
                      sector={
                        resolutionResult.sector || resolutionResult.sectorId
                      }
                    />
                  </div>
                  <div className="smart-resolver-route-name">
                    {resolutionResult.nombreRuta || resolutionResult.nombre}
                  </div>
                </div>

                <span
                  className={`smart-resolver-method-badge ${getMethodBadgeClass(
                    resolutionResult.metodoAsignacion ||
                      resolutionResult.metodoResolucion
                  )}`}
                >
                  {resolutionResult.metodoAsignacion === 'POLIGONO' ||
                  resolutionResult.metodoResolucion === 'POINT_IN_POLYGON'
                    ? 'Dentro de Polígono SIG'
                    : resolutionResult.metodoAsignacion === 'KNN' ||
                        resolutionResult.metodoResolucion ===
                          'NEAREST_CENTROID_KNN'
                      ? 'Vecino Más Cercano (KNN)'
                      : 'Sector Fallback'}
                </span>
              </div>

              <div className="smart-resolver-result-details">
                <div className="smart-resolver-result-item">
                  <span>Secuencia Sugerida:</span>
                  <span>#{resolutionResult.ordenSugerido}</span>
                </div>
                <div className="smart-resolver-result-item">
                  <span>Distancia al límite:</span>
                  <span>
                    {resolutionResult.distanciaMetros
                      ? `${resolutionResult.distanciaMetros} m`
                      : '0 m'}
                  </span>
                </div>
                <div className="smart-resolver-result-item">
                  <span>Acometida Anterior:</span>
                  <span>
                    {resolutionResult.acometidaAnteriorId || 'Inicio de ruta'}
                  </span>
                </div>
              </div>

              {/* Insertion Settings */}
              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.75rem',
                  marginTop: '0.25rem'
                }}
              >
                <h4
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    margin: '0 0 0.5rem'
                  }}
                >
                  Indexar Acometida en esta Ruta
                </h4>
                <div className="smart-resolver-grid">
                  <div className="smart-resolver-field">
                    <label className="smart-resolver-label">
                      Lado de Calle:
                    </label>
                    <select
                      className="smart-resolver-select"
                      value={ladoCalle}
                      onChange={(e) =>
                        setLadoCalle(
                          e.target.value as 'IZQUIERDA' | 'DERECHA' | 'CENTRO'
                        )
                      }
                    >
                      <option value="DERECHA">Derecha</option>
                      <option value="IZQUIERDA">Izquierda</option>
                      <option value="CENTRO">Centro / Pasaje</option>
                    </select>
                  </div>
                  <div className="smart-resolver-field">
                    <label className="smart-resolver-label">
                      Instrucción de Acceso:
                    </label>
                    <input
                      type="text"
                      className="smart-resolver-input"
                      placeholder="Ej. Medidor en zaguán, portón negro"
                      value={instruccionAcceso}
                      onChange={(e) => setInstruccionAcceso(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Map */}
        <div className="smart-resolver-right-panel">
          <SmartRouteResolverMap
            latitud={latitud}
            longitud={longitud}
            sector={sector}
            acometidaId={acometidaId}
            hasCoords={hasCoords}
            onCoordinatesChange={handleCoordinatesChange}
            geojsonData={geojsonData}
            isLoadingGeoJson={isLoadingGeoJson}
            resolvedRouteId={
              resolutionResult?.rutaId || resolutionResult?.idRuta
            }
            resolvedRouteCode={
              resolutionResult?.codigoRuta || resolutionResult?.codigo
            }
            resolvedRouteName={
              resolutionResult?.nombreRuta || resolutionResult?.nombre
            }
          />
        </div>
      </div>
    </Modal>
  );
};
