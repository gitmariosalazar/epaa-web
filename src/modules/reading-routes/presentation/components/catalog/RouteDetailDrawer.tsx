import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Zap,
  MapPin,
  Search,
  ArrowUpDown,
  Clock,
  UserPlus,
  ArrowRightLeft,
  Layers,
  Timer,
  Map,
  Gauge
} from 'lucide-react';
import type { ReadingRoute } from '../../../domain/models/ReadingRoute';
import type { RouteConnection } from '../../../domain/models/RouteConnection';
import { RouteBadge } from '../common/RouteBadge';
import './RouteDetailDrawer.css';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { FaTachometerAlt, FaUser } from 'react-icons/fa';
import { Avatar } from '@/shared/presentation/components/Avatar/Avatar';
import { PiSealWarningFill } from 'react-icons/pi';

interface RouteDetailDrawerProps {
  isOpen: boolean;
  route: ReadingRoute | null;
  connections: RouteConnection[];
  isLoading: boolean;
  isOptimizing: boolean;
  onClose: () => void;
  onOptimize: (idRuta: number) => Promise<void>;
  onAssignRoute?: (route: ReadingRoute) => void;
  onReassignRoute?: (route: ReadingRoute) => void;
}

export const RouteDetailDrawer: React.FC<RouteDetailDrawerProps> = ({
  isOpen,
  route,
  connections,
  isLoading,
  isOptimizing,
  onClose,
  onOptimize,
  onAssignRoute,
  onReassignRoute
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const PAGE_SIZE = 50;
  const [renderedLimit, setRenderedLimit] = useState<number>(PAGE_SIZE);

  // Reiniciar límite al cambiar la ruta o los filtros
  useEffect(() => {
    setRenderedLimit(PAGE_SIZE);
  }, [route?.idRuta, searchTerm, sortOrder]);

  const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      setRenderedLimit((prev) => Math.min(prev + PAGE_SIZE, filteredConnections.length));
    }
  };

  const filteredConnections = useMemo(() => {
    let list = [...connections];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
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
          String(c.direccion ?? '')
            .toLowerCase()
            .includes(q) ||
          String(c.acometidaId ?? '')
            .toLowerCase()
            .includes(q)
      );
    }
    list.sort((a, b) => {
      const diff = a.ordenSecuencia - b.ordenSecuencia;
      return sortOrder === 'asc' ? diff : -diff;
    });
    return list;
  }, [connections, searchTerm, sortOrder]);

  if (!isOpen || !route) return null;

  return (
    <div className="route-drawer-overlay" onClick={onClose}>
      <div
        className="route-drawer-container"
        onClick={(e) => e.stopPropagation()}
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
            {(() => {
              const assignedUser = route.usuario || route.nombreUsuario;
              const isAssigned = Boolean(
                route.idAsignacion ||
                route.idUsuarioAsignado ||
                assignedUser ||
                (route.estado &&
                  route.estado.toUpperCase() !== 'NO_ASIGNADA' &&
                  route.estado.toUpperCase() !== 'SIN_ASIGNAR')
              );
              const label =
                assignedUser ||
                (isAssigned ? (route.estado || 'Asignada') : 'Sin Asignar');
              const isAssignedStatus = isAssigned && label !== 'Sin Asignar';

              return (
                <Tooltip
                  content={
                    isAssignedStatus
                      ? `Asignado a: ${label}`
                      : 'Esta ruta no tiene usuario asignado'
                  }
                  followCursor={false}
                  themeColor="gray"
                >
                  <ColorChip
                    label={label}
                    variant="soft"
                    size="xs"
                    color={
                      isAssignedStatus
                        ? (route.colorIdentificador || '#0284c7')
                        : 'red'
                    }
                    icon={isAssignedStatus ? <FaUser /> : <PiSealWarningFill />}
                  />
                </Tooltip>
              );
            })()}
          </span>
        </div>

        {/* KPIs */}
        <div className="route-drawer-kpis">
          <div className="route-drawer-kpi-item">
            <span className="route-drawer-kpi-label">
              <Layers size={12} />
              Acometidas
            </span>
            <span className="route-drawer-kpi-val">
              {route.cantidadAcometidas ?? connections.length}
            </span>
          </div>

          <div className="route-drawer-kpi-item">
            <span className="route-drawer-kpi-label">
              <Timer size={12} />
              Tiempo Est.
            </span>
            <span className="route-drawer-kpi-val">
              {route.tiempoEstimadoHoras
                ? `${route.tiempoEstimadoHoras} h`
                : 'N/D'}
            </span>
          </div>

          <div className="route-drawer-kpi-item">
            <span className="route-drawer-kpi-label">
              <Map size={12} />
              Sector
            </span>
            <span className="route-drawer-kpi-val">
              {route.sectorId || 'N/A'}
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="route-drawer-toolbar">
          <div className="route-drawer-search-wrap">
            <Input
              type="text"
              placeholder="Buscar medidor, abonado, cuenta..."
              value={searchTerm}
              size="small"
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>

          <Tooltip
            content="Invertir orden de secuencia"
            followCursor={false}
            themeColor="info"
          >
            <Button
              variant="outline"
              onClick={() =>
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
              }
              size="xs"
              leftIcon={<ArrowUpDown size={14} />}
              circle
            />
          </Tooltip>

          {!Boolean(
            route.idAsignacion ||
            route.idUsuarioAsignado ||
            (route.estado &&
              route.estado.toUpperCase() !== 'NO_ASIGNADA' &&
              route.estado.toUpperCase() !== 'SIN_ASIGNAR')
          ) &&
            onAssignRoute && (
              <Tooltip
                content="Asignar esta ruta a un lecturista"
                followCursor={false}
                themeColor="green"
              >
                <Button
                  variant="outline"
                  onClick={() => onAssignRoute(route)}
                  leftIcon={<UserPlus size={14} />}
                  size="xs"
                  color="green"
                  circle
                />
              </Tooltip>
            )}

          {Boolean(
            route.idAsignacion ||
            route.idUsuarioAsignado ||
            (route.estado &&
              route.estado.toUpperCase() !== 'NO_ASIGNADA' &&
              route.estado.toUpperCase() !== 'SIN_ASIGNAR')
          ) &&
            onReassignRoute && (
              <Tooltip
                content="Reasignar esta ruta a otro operador en campo"
                followCursor={false}
                themeColor="accent"
              >
                <Button
                  variant="outline"
                  onClick={() => onReassignRoute(route)}
                  leftIcon={<ArrowRightLeft size={14} />}
                  size="xs"
                  color="primary"
                  circle
                />
              </Tooltip>
            )}

          <Tooltip
            followCursor={false}
            themeColor="amber"
            content="Optimizar recorrido usando algoritmo TSP en PostGIS"
          >
            <Button
              variant="dashed"
              color="amber"
              onClick={() => onOptimize(route.idRuta)}
              disabled={isOptimizing || connections.length < 2}
              leftIcon={
                <Zap size={14} className={isOptimizing ? 'animate-spin' : ''} />
              }
              size="xs"
            >
              {isOptimizing ? '...' : 'TSP'}
            </Button>
          </Tooltip>
        </div>

        {/* Body / Connection List */}
        <div className="route-drawer-body" onScroll={handleBodyScroll}>
          {isLoading ? (
            <div className="route-drawer-loading">
              <Clock
                size={32}
                className="animate-spin route-drawer-loading-icon"
              />
              <div style={{ fontWeight: 600 }}>
                Cargando secuencia de medidores...
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>
                Esto puede tardar unos segundos
              </div>
            </div>
          ) : filteredConnections.length === 0 ? (
            <div className="route-drawer-empty">
              <MapPin size={36} className="route-drawer-empty-icon" />
              <div style={{ fontWeight: 600 }}>No se encontraron medidores</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>
                {searchTerm
                  ? 'Prueba con otro término de búsqueda'
                  : 'Esta ruta aún no tiene acometidas asociadas'}
              </div>
            </div>
          ) : (
            <>
              {filteredConnections.slice(0, renderedLimit).map((c) => (
                <div
                  key={c.idRutaAcometida || c.acometidaId}
                  className="route-drawer-card"
                >
                  {/* Top row: sequence + meter */}
                  <div className="route-drawer-card-top">
                    <span className="route-drawer-seq">
                      Orden Secuencia # {c.ordenSecuencia}
                    </span>
                    <span className="route-drawer-meter">
                      <Tooltip
                        content="Numero de medidor"
                        followCursor={false}
                        themeColor="gray"
                      >
                        <ColorChip
                          label={`${c.numeroMedidor}`}
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
                      name={c.abonado || 'Consumidor desconocido'}
                    />
                    <div className="route-drawer-user-name">
                      <span className="route-drawer-user-name-text">
                        {c.abonado || 'Consumidor desconocido'}
                      </span>
                      <span className="route-drawer-user-id">{c.clienteId}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="route-drawer-address">
                    <MapPin size={12} className="route-drawer-address-icon" />
                    <span>
                      {c.direccion || c.referencia || 'Sin dirección registrada'}
                    </span>
                  </div>

                  {/* Footer meta */}
                  <div className="route-drawer-footer-row">
                    <span className="route-drawer-footer-item">
                      Sector: <strong>{c.sector || 'N/A'}</strong>
                    </span>
                    <span className="route-drawer-footer-item">
                      Acometida: <strong>{c.acometidaId}</strong>
                    </span>
                    {typeof c.consumoPromedio === 'number' && (
                      <span className="route-drawer-footer-item">
                        <Gauge size={11} />
                        Prom: <strong>{c.consumoPromedio} m³</strong>
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {renderedLimit < filteredConnections.length && (
                <div style={{ textAlign: 'center', padding: '0.75rem' }}>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() =>
                      setRenderedLimit((prev) =>
                        Math.min(prev + PAGE_SIZE, filteredConnections.length)
                      )
                    }
                  >
                    Cargar más ({filteredConnections.length - renderedLimit} restantes)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
