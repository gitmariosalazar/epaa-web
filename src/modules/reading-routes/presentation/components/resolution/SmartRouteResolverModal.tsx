import React, { useState, useEffect } from 'react';
import {
  X,
  Compass,
  Search,
  PlusCircle,
} from 'lucide-react';
import { useReadingRoutesContext } from '../../context/ReadingRoutesContext';
import type { RouteResolution } from '../../../domain/models/RouteResolution';
import { RouteBadge } from '../common/RouteBadge';
import { notify } from '../../utils/notify';
import { FALLBACK_CENTER_ANTONIO_ANTE } from '@/shared/utils/types/IGeolocationData';
import './SmartRouteResolverModal.css';
import { Button } from '@/shared/presentation/components/Button/Button';

interface SmartRouteResolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
  initialAcometidaId?: string;
  onSuccessInsert?: () => void;
}

export const SmartRouteResolverModal: React.FC<SmartRouteResolverModalProps> = ({
  isOpen,
  onClose,
  initialLat,
  initialLng,
  initialAcometidaId,
  onSuccessInsert,
}) => {
  const { resolveRouteForConnectionUseCase, insertConnectionIntoRouteUseCase } =
    useReadingRoutesContext();

  const [latitud, setLatitud] = useState<number>(
    initialLat ?? FALLBACK_CENTER_ANTONIO_ANTE.lat,
  );
  const [longitud, setLongitud] = useState<number>(
    initialLng ?? FALLBACK_CENTER_ANTONIO_ANTE.lng,
  );
  const [acometidaId, setAcometidaId] = useState<string>(initialAcometidaId ?? '');
  const [sector, setSector] = useState<number | undefined>(undefined);

  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [resolutionResult, setResolutionResult] = useState<RouteResolution | null>(null);

  // Form fields for insertion
  const [ladoCalle, setLadoCalle] = useState<'IZQUIERDA' | 'DERECHA' | 'CENTRO'>('DERECHA');
  const [instruccionAcceso, setInstruccionAcceso] = useState<string>('');
  const [isInserting, setIsInserting] = useState<boolean>(false);

  useEffect(() => {
    queueMicrotask(() => {
      if (initialLat !== undefined) setLatitud(initialLat);
      if (initialLng !== undefined) setLongitud(initialLng);
      if (initialAcometidaId !== undefined) setAcometidaId(initialAcometidaId);
    });
  }, [initialLat, initialLng, initialAcometidaId]);

  if (!isOpen) return null;

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResolving(true);
    try {
      const result = await resolveRouteForConnectionUseCase.execute(
        latitud,
        longitud,
        sector,
        acometidaId || undefined,
      );
      setResolutionResult(result);
      notify.success(
        `Ruta identificada: ${result.codigoRuta || result.codigo} (${result.metodoAsignacion || result.metodoResolucion})`,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      notify.error('Error al resolver ruta espacial: ' + msg);
    } finally {
      setIsResolving(false);
    }
  };

  const handleInsert = async () => {
    if (!resolutionResult || !acometidaId) {
      notify.error('Debe especificar un ID de acometida para insertarla en la ruta.');
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
        instruccionAcceso,
      });

      notify.success(
        `Acometida insertada exitosamente en la Ruta #${resolutionResult.codigoRuta || resolutionResult.codigo} en la secuencia #${res.ordenSecuencia ?? ''}.`,
      );
      if (onSuccessInsert) {
        onSuccessInsert();
      }
      onClose();
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

  return (
    <div className="smart-resolver-overlay" onClick={onClose}>
      <div className="smart-resolver-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="smart-resolver-header">
          <h2 className="smart-resolver-title">
            <Compass size={18} style={{ color: 'var(--accent)' }} />
            Enrutador Inteligente PostGIS para Nueva Acometida
          </h2>
          <Button variant='ghost' onClick={onClose} aria-label="Cerrar" leftIcon={<X size={18} />} size='xs' />
        </div>

        {/* Body */}
        <div className="smart-resolver-body">
          <p className="smart-resolver-intro">
            Determina automáticamente mediante Point-in-Polygon (ST_Contains) o K-Nearest Neighbors (KNN PostGIS) la ruta exacta y el orden secuencial óptimo para una acometida nueva.
          </p>

          <form onSubmit={handleResolve} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="smart-resolver-grid">
              <div className="smart-resolver-field">
                <label className="smart-resolver-label">ID o Código Acometida:</label>
                <input
                  type="text"
                  className="smart-resolver-input"
                  placeholder="Ej. ACM-09823"
                  value={acometidaId}
                  onChange={e => setAcometidaId(e.target.value)}
                  required
                />
              </div>

              <div className="smart-resolver-field">
                <label className="smart-resolver-label">Sector (Opcional):</label>
                <select
                  className="smart-resolver-select"
                  value={sector ?? ''}
                  onChange={e => setSector(e.target.value ? Number(e.target.value) : undefined)}
                >
                  <option value="">Auto-detectar por coordenadas</option>
                  <option value="1">Sector 1 (Centro)</option>
                  <option value="2">Sector 2 (Andrade Marín)</option>
                  <option value="3">Sector 3 (San Roque)</option>
                  <option value="4">Sector 4 (Chaltura/Natabuela)</option>
                </select>
              </div>
            </div>

            <div className="smart-resolver-grid">
              <div className="smart-resolver-field">
                <label className="smart-resolver-label">Latitud (WGS84):</label>
                <input
                  type="number"
                  step="any"
                  className="smart-resolver-input"
                  value={latitud}
                  onChange={e => setLatitud(Number(e.target.value))}
                  required
                />
              </div>

              <div className="smart-resolver-field">
                <label className="smart-resolver-label">Longitud (WGS84):</label>
                <input
                  type="number"
                  step="any"
                  className="smart-resolver-input"
                  value={longitud}
                  onChange={e => setLongitud(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isResolving}
              leftIcon={<Search size={14} className={isResolving ? 'animate-spin' : ''} />}
              size='xs'
              variant='primary'
            >
              {isResolving ? 'Calculando en PostGIS...' : 'Resolver Ruta Espacial'}
            </Button>
          </form>

          {/* Result Card */}
          {resolutionResult && (
            <div className="smart-resolver-result">
              <div className="smart-resolver-result-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--accent)', fontSize: '1.1rem' }}>
                      {resolutionResult.codigoRuta || resolutionResult.codigo}
                    </span>
                    <RouteBadge sector={resolutionResult.sector || resolutionResult.sectorId} />
                  </div>
                  <div className="smart-resolver-route-name">
                    {resolutionResult.nombreRuta || resolutionResult.nombre}
                  </div>
                </div>

                <span
                  className={`smart-resolver-method-badge ${getMethodBadgeClass(
                    resolutionResult.metodoAsignacion || resolutionResult.metodoResolucion,
                  )}`}
                >
                  {resolutionResult.metodoAsignacion === 'POLIGONO' || resolutionResult.metodoResolucion === 'POINT_IN_POLYGON'
                    ? 'Dentro de Polígono SIG'
                    : resolutionResult.metodoAsignacion === 'KNN' || resolutionResult.metodoResolucion === 'NEAREST_CENTROID_KNN'
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
                  <span>{resolutionResult.distanciaMetros ? `${resolutionResult.distanciaMetros} m` : '0 m'}</span>
                </div>
                <div className="smart-resolver-result-item">
                  <span>Acometida Anterior:</span>
                  <span>{resolutionResult.acometidaAnteriorId || 'Inicio de ruta'}</span>
                </div>
              </div>

              {/* Insertion Settings */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
                  Indexar Acometida en esta Ruta
                </h4>
                <div className="smart-resolver-grid">
                  <div className="smart-resolver-field">
                    <label className="smart-resolver-label">Lado de Calle:</label>
                    <select
                      className="smart-resolver-select"
                      value={ladoCalle}
                      onChange={e => setLadoCalle(e.target.value as 'IZQUIERDA' | 'DERECHA' | 'CENTRO')}
                    >
                      <option value="DERECHA">Derecha</option>
                      <option value="IZQUIERDA">Izquierda</option>
                      <option value="CENTRO">Centro / Pasaje</option>
                    </select>
                  </div>
                  <div className="smart-resolver-field">
                    <label className="smart-resolver-label">Instrucción de Acceso:</label>
                    <input
                      type="text"
                      className="smart-resolver-input"
                      placeholder="Ej. Medidor en zaguán, portón negro"
                      value={instruccionAcceso}
                      onChange={e => setInstruccionAcceso(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="smart-resolver-footer">
          <Button variant='ghost' size='xs' onClick={onClose} disabled={isInserting}>
            Cerrar
          </Button>
          {resolutionResult && (
            <Button
              onClick={handleInsert}
              disabled={isInserting || !acometidaId}
              size='xs'
              variant='primary'
              leftIcon={<PlusCircle size={14} className={isInserting ? 'animate-spin' : ''} />}
            >
              {isInserting ? 'Indexando en Ruta...' : 'Insertar en Secuencia de Ruta'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
