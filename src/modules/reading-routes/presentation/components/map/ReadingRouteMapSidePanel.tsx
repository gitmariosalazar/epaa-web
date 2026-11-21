import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback
} from 'react';
import {
  X,
  Zap,
  MapPin,
  Search,
  ArrowUpDown,
  Clock,
  Navigation,
  UserPlus,
  Home,
  Gauge,
  ArrowRightLeft
} from 'lucide-react';
import type { ReadingRoute } from '../../../domain/models/ReadingRoute';
import type { RouteConnection } from '../../../domain/models/RouteConnection';
import { RouteBadge } from '../common/RouteBadge';
import './ReadingRouteMapSidePanel.css';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { FaTachometerAlt, FaUser } from 'react-icons/fa';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { PiSealWarningFill } from 'react-icons/pi';

interface ReadingRouteMapSidePanelProps {
  route: ReadingRoute | null;
  connections: RouteConnection[];
  isLoadingConnections: boolean;
  isOptimizing: boolean;
  onClose: () => void;
  onOptimize: (idRuta: number) => Promise<void>;
  onFocusConnection?: (lat: number, lng: number) => void;
  onAssignRoute?: (route: ReadingRoute) => void;
  onReassignRoute?: (route: ReadingRoute) => void;
  showConnectionPoints?: boolean;
  onToggleConnectionPoints?: () => void;
  selectedConnectionId?: number | string | null;
  onSelectConnection?: (connection: RouteConnection) => void;
}

const getValidCoords = (
  lat: unknown,
  lng: unknown
): { lat: number; lng: number } | null => {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return null;
  }
  const numLat = typeof lat === 'number' ? lat : parseFloat(String(lat));
  const numLng = typeof lng === 'number' ? lng : parseFloat(String(lng));
  if (!Number.isFinite(numLat) || !Number.isFinite(numLng)) {
    return null;
  }
  if (numLat < -90 || numLat > 90 || numLng < -180 || numLng > 180) {
    return null;
  }
  return { lat: numLat, lng: numLng };
};

export const ReadingRouteMapSidePanel: React.FC<
  ReadingRouteMapSidePanelProps
> = ({
  route,
  connections,
  isLoadingConnections,
  isOptimizing,
  onClose,
  onOptimize,
  onFocusConnection,
  onAssignRoute,
  onReassignRoute,
  showConnectionPoints,
  onToggleConnectionPoints,
  selectedConnectionId,
  onSelectConnection
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [internalEnablePoints, setInternalEnablePoints] = useState(true);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isPointsVisible =
    showConnectionPoints !== undefined
      ? showConnectionPoints
      : internalEnablePoints;

  const handleTogglePoints = useCallback(() => {
    if (onToggleConnectionPoints) {
      onToggleConnectionPoints();
    } else {
      setInternalEnablePoints((prev) => !prev);
    }
  }, [onToggleConnectionPoints]);

  const filteredConnections = useMemo(() => {
    if (!connections) return [];
    let result = [...connections];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          String(c.numeroMedidor ?? '')
            .toLowerCase()
            .includes(q) ||
          String(c.abonado ?? '')
            .toLowerCase()
            .includes(q) ||
          String(c.cuenta ?? '')
            .toLowerCase()
            .includes(q) ||
          String(c.acometidaId ?? '')
            .toLowerCase()
            .includes(q) ||
          String(c.direccion ?? '')
            .toLowerCase()
            .includes(q)
      );
    }
    result.sort((a, b) => {
      const diff = a.ordenSecuencia - b.ordenSecuencia;
      return sortOrder === 'asc' ? diff : -diff;
    });
    return result;
  }, [connections, searchTerm, sortOrder]);

  // Reset selection when route changes
  useEffect(() => {
    setSelectedIndex(null);
  }, [route?.idRuta]);

  // Handle focusing and selecting connection by index
  const selectConnectionByIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= filteredConnections.length) return;
      setSelectedIndex(index);
      const conn = filteredConnections[index];
      if (conn) {
        const coords = getValidCoords(conn.latitud, conn.longitud);
        if (coords && onFocusConnection) {
          onFocusConnection(coords.lat, coords.lng);
        }
        if (onSelectConnection) {
          onSelectConnection(conn);
        }
      }
    },
    [filteredConnections, onFocusConnection, onSelectConnection]
  );

  // Sync external selection from map to side panel
  useEffect(() => {
    if (selectedConnectionId !== undefined && selectedConnectionId !== null) {
      const idx = filteredConnections.findIndex(
        (c) =>
          c.idRutaAcometida === selectedConnectionId ||
          c.acometidaId === selectedConnectionId
      );
      if (idx !== -1 && idx !== selectedIndex) {
        setSelectedIndex(idx);
      }
    }
  }, [selectedConnectionId, filteredConnections, selectedIndex]);

  // Auto-scroll selected card into view smoothly
  useEffect(() => {
    if (selectedIndex !== null && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedIndex]);

  // Keyboard navigation: ArrowDown / ArrowUp to move between cards automatically
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredConnections.length === 0) return;

      const activeEl = document.activeElement;
      if (activeEl?.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next =
            prev === null
              ? 0
              : Math.min(prev + 1, filteredConnections.length - 1);
          const conn = filteredConnections[next];
          if (conn) {
            const coords = getValidCoords(conn.latitud, conn.longitud);
            if (coords && onFocusConnection) {
              onFocusConnection(coords.lat, coords.lng);
            }
            if (onSelectConnection) {
              onSelectConnection(conn);
            }
          }
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev === null ? 0 : Math.max(prev - 1, 0);
          const conn = filteredConnections[next];
          if (conn) {
            const coords = getValidCoords(conn.latitud, conn.longitud);
            if (coords && onFocusConnection) {
              onFocusConnection(coords.lat, coords.lng);
            }
            if (onSelectConnection) {
              onSelectConnection(conn);
            }
          }
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredConnections, onFocusConnection, onSelectConnection]);

  if (!route) return null;

  const isAssigned = Boolean(
    route.idAsignacion ||
    route.idUsuarioAsignado ||
    (route.estado &&
      route.estado.toUpperCase() !== 'NO_ASIGNADA' &&
      route.estado.toUpperCase() !== 'SIN_ASIGNAR')
  );

  const isCompleted: boolean = route.estado === 'COMPLETADA';

  console.log('Route:', route);

  return (
    <aside
      className="route-side-panel"
      aria-label={`Detalle de la ruta ${route.codigoRuta}`}
    >
      {/* Header */}
      <div className="route-side-panel-header">
        <div className="route-side-panel-title-group">
          <div className="route-side-panel-code-row">
            <span className="route-side-panel-code">{route.codigo}</span>
            <RouteBadge sector={route.sectorId} />
            <span
              className={`status-pill ${route.activa ? 'status-active' : 'status-inactive'}`}
            >
              {route.activa === true ? 'Activa' : 'Inactiva'}
            </span>
          </div>
          <h3 className="route-side-panel-name">{route.nombreRuta}</h3>
        </div>
        <Tooltip
          content="Cerrar panel de ruta"
          position="left"
          themeColor="red"
          followCursor={false}
        >
          <Button
            onClick={onClose}
            aria-label="Cerrar panel de ruta"
            leftIcon={<X size={15} />}
            circle
            color="red"
            variant="danger"
            size="xs"
          />
        </Tooltip>
      </div>

      <div className="route-connection-info">
        <Tooltip
          content={`${route.descripcion}`}
          followCursor={false}
          themeColor="gray"
        >
          <span className="route-connection-seq route-drawer-seq">
            {`${route.nombre}`}
          </span>
        </Tooltip>
        <span className="route-drawer-meter">
          <Tooltip
            content={
              route.usuario
                ? `${route.nombreUsuario}`
                : 'Esta ruta no tiene usuario asignado'
            }
            followCursor={false}
            themeColor="gray"
          >
            <ColorChip
              label={route.usuario ? `${route.usuario}` : 'Sin Asignar'}
              variant="soft"
              size="xs"
              color={route.usuario ? `${route.colorIdentificador}` : 'red'}
              icon={route.usuario ? <FaUser /> : <PiSealWarningFill />}
            />
          </Tooltip>
        </span>
      </div>

      {/* Metrics Bar */}
      <div className="route-side-panel-metrics">
        <div className="route-metric-card connection-color">
          <span className="route-metric-label">Acometidas</span>
          <span className="route-metric-value">
            {route.cantidadAcometidas ?? connections.length}
          </span>
          <span className="route-metric-icon connection-icon-color">
            <Home size={15} />
          </span>
        </div>
        <div className="route-metric-card time-color">
          <span className="route-metric-label">Tiempo Est.</span>
          <span className="route-metric-value">
            {route.tiempoEstimadoHoras
              ? `${route.tiempoEstimadoHoras}h`
              : 'N/D'}
          </span>
          <span className="route-metric-icon time-icon-color">
            <Clock size={15} />
          </span>
        </div>
        <div className="route-metric-card sector-color">
          <span className="route-metric-label">Sector</span>
          <span className="route-metric-value">{route.sector || 'N/A'}</span>
          <span className="route-metric-icon sector-icon-color">
            <MapPin size={15} />
          </span>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="route-side-panel-actions-container">
        <div className="route-side-panel-search-box">
          <div
            className="input-group"
            style={{ display: 'flex', gap: '0.5rem' }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <Input
                type="text"
                placeholder="Buscar medidor, abonado, cuenta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={16} />}
                size="small"
              />
            </div>
            {!isAssigned && onAssignRoute && (
              <Tooltip
                content="Asignar esta ruta a un lecturista"
                followCursor={false}
                themeColor="info"
              >
                <Button
                  variant="dashed"
                  onClick={() => onAssignRoute(route)}
                  leftIcon={<UserPlus size={13} />}
                  size="xs"
                  circle
                  color="info"
                  disabled={isCompleted}
                ></Button>
              </Tooltip>
            )}
            {isAssigned && onReassignRoute && (
              <Tooltip
                content="Reasignar esta ruta a otro operador en campo"
                followCursor={false}
                themeColor="amber"
              >
                <Button
                  variant="dashed"
                  onClick={() => onReassignRoute(route)}
                  leftIcon={<ArrowRightLeft size={13} />}
                  size="xs"
                  color="amber"
                  circle
                  disabled={isCompleted}
                ></Button>
              </Tooltip>
            )}
            <Tooltip
              content="Reordenar la secuencia de lecturas aplicando el algoritmo de optimización TSP PostGIS"
              themeColor="info"
              followCursor={false}
            >
              <Button
                onClick={() => onOptimize(route.idRuta)}
                disabled={isOptimizing || connections.length < 2}
                leftIcon={
                  <Zap
                    size={15}
                    className={isOptimizing ? 'animate-spin' : ''}
                  />
                }
                circle
                variant="dashed"
                size="xs"
              />
            </Tooltip>
            <Tooltip
              content={`Orden: ${sortOrder === 'asc' ? 'Ascendente (1..N)' : 'Descendente (N..1)'}`}
              themeColor="amber"
              followCursor={false}
            >
              <Button
                onClick={() =>
                  setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                }
                leftIcon={<ArrowUpDown size={15} />}
                circle
                color="amber"
                variant="dashed"
                size="xs"
              />
            </Tooltip>
          </div>
          <div className="route-connections-header-info">
            <span>
              Mostrando {filteredConnections.length} de {connections.length}{' '}
              acometidas
            </span>

            <Tooltip
              content={
                isPointsVisible
                  ? 'Ocultar marcadores de acometidas en el mapa'
                  : 'Mostrar marcadores de acometidas en el mapa'
              }
              themeColor="info"
              followCursor={false}
            >
              <button
                type="button"
                className={`route-points-toggle-btn ${isPointsVisible ? 'active' : ''}`}
                onClick={handleTogglePoints}
                aria-label={
                  isPointsVisible
                    ? 'Ocultar puntos de acometidas'
                    : 'Activar puntos de acometidas'
                }
              >
                {isPointsVisible ? (
                  <RiEyeFill size={13} />
                ) : (
                  <RiEyeOffFill size={13} />
                )}
                <span>
                  {isPointsVisible ? 'Puntos activos' : 'Activar puntos'}
                </span>
              </button>
            </Tooltip>
            <Tooltip
              content="Usa las flechas ↑ y ↓ para seleccionar y centrar"
              themeColor="info"
              followCursor={false}
            >
              <span className="route-panel-kbd-hint">
                <kbd>↑</kbd> <kbd>↓</kbd>
              </span>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Content / Connection list */}
      <div className="route-side-panel-content">
        {isLoadingConnections ? (
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--text-muted)'
            }}
          >
            <Clock
              size={24}
              className="animate-spin"
              style={{ margin: '0 auto 0.5rem' }}
            />
            <p style={{ fontSize: '0.85rem' }}>
              Cargando secuencia de acometidas...
            </p>
          </div>
        ) : filteredConnections.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--text-muted)'
            }}
          >
            <MapPin
              size={28}
              style={{ opacity: 0.5, margin: '0 auto 0.5rem' }}
            />
            <p style={{ fontSize: '0.85rem' }}>
              {searchTerm
                ? 'No se encontraron acometidas con ese filtro.'
                : 'Esta ruta no tiene acometidas asociadas.'}
            </p>
          </div>
        ) : (
          <div className="route-connections-list">
            {filteredConnections.map((conn, index) => {
              const coords = getValidCoords(conn.latitud, conn.longitud);
              const isSelected = selectedIndex === index;

              return (
                <div
                  key={conn.idRutaAcometida || conn.acometidaId}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className={`route-connection-card ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => selectConnectionByIndex(index)}
                  role="button"
                  tabIndex={0}
                  aria-selected={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      selectConnectionByIndex(index);
                    }
                  }}
                  style={{ cursor: coords ? 'pointer' : 'default' }}
                >
                  <div className="route-connection-header">
                    <span className="route-connection-seq route-drawer-seq">
                      Orden Secuencia # {conn.ordenSecuencia}
                    </span>
                    <span className="route-drawer-meter">
                      <Tooltip
                        content="Numero de medidor"
                        followCursor={false}
                        themeColor="gray"
                      >
                        <ColorChip
                          label={`${conn.numeroMedidor}`}
                          color=""
                          variant="ghost"
                          size="xs"
                          icon={<FaTachometerAlt />}
                        />
                      </Tooltip>
                    </span>
                  </div>
                  {/* User */}
                  <div className="route-drawer-user">
                    <Avatar
                      size="sm"
                      name={conn.abonado || 'Consumidor desconocido'}
                    />
                    <div className="route-drawer-user-name">
                      <span className="route-drawer-user-name-text">
                        {conn.abonado || 'Consumidor desconocido'}
                      </span>
                      <span className="route-drawer-user-id">
                        {conn.clienteId}
                      </span>
                    </div>
                  </div>
                  {/* Address */}
                  <div className="route-drawer-address">
                    <MapPin size={12} className="route-drawer-address-icon" />
                    <span>
                      {conn.direccion ||
                        conn.referencia ||
                        'Sin dirección registrada'}
                    </span>
                  </div>
                  <div className="route-connection-footer">
                    <div className="route-drawer-footer-row">
                      <span className="route-drawer-footer-item">
                        Sector: <strong>{conn.sector || 'N/A'}</strong>
                      </span>
                      <span className="route-drawer-footer-item">
                        Acometida: <strong>{conn.acometidaId}</strong>
                      </span>
                      {typeof conn.consumoPromedio === 'number' && (
                        <span className="route-drawer-footer-item">
                          <Gauge size={11} />
                          Prom: <strong>{conn.consumoPromedio} m³</strong>
                        </span>
                      )}
                    </div>
                    {coords ? (
                      <span
                        style={{
                          color: 'var(--accent)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontWeight: 600
                        }}
                      >
                        <Navigation size={11} />{' '}
                        {isSelected ? 'Enfocada' : 'Centrar'}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: 'var(--text-muted)',
                          fontSize: '0.725rem'
                        }}
                      >
                        Sin geolocalización
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
