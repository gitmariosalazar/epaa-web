import React, { useMemo } from 'react';
import {
  Search,
  MapPin,
  ListOrdered,
  Zap,
  Filter,
  Layers,
  Compass,
  UserPlus,
  ArrowRightLeft,
  Calendar,
  Clock,
  User,
  RotateCcw
} from 'lucide-react';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import { DatePicker } from '@/shared/presentation/components/DatePicker/DatePicker';
import type { ReadingRoute } from '../../../domain/models/ReadingRoute';
import { RouteBadge } from '../common/RouteBadge';
import './RouteCatalogTable.css';
import { Select } from '@/shared/presentation/components/Input/Select';

import { sectors as DEFAULT_SECTORS } from '@/shared/utils/listSectors';

interface RouteCatalogTableProps {
  routes: ReadingRoute[];
  isLoading: boolean;
  totalRoutes: number;
  page: number;
  limit: number;
  searchTerm: string;
  selectedSector: number | undefined;
  activaOnly: boolean | undefined;
  estadoFilter: string;
  periodoFilter: string;
  onSearchChange: (search: string) => void;
  onSectorChange: (sector: number | undefined) => void;
  onActivaChange: (activa: boolean | undefined) => void;
  onEstadoChange: (estado: string) => void;
  onPeriodoChange: (periodo: string) => void;
  onResetFilters?: () => void;
  onPageChange: (page: number) => void;
  onViewInMap: (idRuta: number) => void;
  onInspectRoute: (idRuta: number) => void;
  onOptimize: (idRuta: number) => void;
  onAssignRoute?: (route: ReadingRoute) => void;
  onReassignRoute?: (route: ReadingRoute) => void;
}

export const RouteCatalogTable: React.FC<RouteCatalogTableProps> = ({
  routes,
  isLoading,
  totalRoutes,
  page,
  limit,
  searchTerm,
  selectedSector,
  activaOnly,
  estadoFilter,
  periodoFilter,
  onSearchChange,
  onSectorChange,
  onActivaChange,
  onEstadoChange,
  onPeriodoChange,
  onResetFilters,
  onPageChange,
  onViewInMap,
  onInspectRoute,
  onOptimize,
  onAssignRoute,
  onReassignRoute
}) => {
  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
    selectedSector !== undefined ||
    activaOnly !== undefined ||
    (estadoFilter && estadoFilter !== 'TODOS')
  );

  const columns = useMemo<Column<ReadingRoute>[]>(
    () => [
      {
        header: 'Código',
        accessor: (r: ReadingRoute) => (
          <span className="route-catalog-code-cell">
            {r.codigoRuta || r.codigo || `R-${r.idRuta}`}
          </span>
        ),
        sortable: true,
        sortKey: 'codigo',
        style: { width: '100px' }
      },
      {
        header: 'Nombre de la Ruta',
        accessor: (r: ReadingRoute) => (
          <span className="route-catalog-name-cell">
            {r.nombreRuta || r.nombre}
          </span>
        ),
        sortable: true,
        sortKey: 'nombre'
      },
      {
        header: 'Sector',
        accessor: (r: ReadingRoute) => (
          <RouteBadge sector={r.sectorId ?? r.sector} />
        ),
        style: { width: '120px' }
      },
      {
        header: 'Acometidas',
        accessor: (r: ReadingRoute) => (
          <span style={{ fontWeight: 600 }}>{r.cantidadAcometidas ?? 0}</span>
        ),
        isNumeric: true,
        sortable: true,
        sortKey: 'cantidadAcometidas',
        style: { width: '100px', textAlign: 'center' }
      },
      {
        header: 'Tiempo Est.',
        accessor: (r: ReadingRoute) => (
          <span style={{ color: 'var(--text-secondary)' }}>
            {r.tiempoEstimadoHoras ? `${r.tiempoEstimadoHoras} h` : '—'}
          </span>
        ),
        style: { width: '100px', textAlign: 'center' }
      },
      {
        header: 'Asignación',
        accessor: (r: ReadingRoute) => {
          if (r.estado) {
            return <RouteBadge status={r.estado} />;
          }
          return (
            <RouteBadge
              status="NO_ASIGNADA"
              label="Sin Asignar"
              className="route-badge-no_asignada"
            />
          );
        },
        style: { width: '130px', textAlign: 'center' }
      },
      {
        header: 'Lecturista',
        accessor: (r: ReadingRoute) => {
          const nombre = r.nombreUsuario || r.usuario;
          if (!nombre) {
            return <span className="route-catalog-unassigned-dash">—</span>;
          }
          return (
            <span
              className="route-catalog-operator-cell"
              title={`Asignado a: ${nombre}`}
            >
              <User size={13} className="route-catalog-operator-icon" />
              <span className="route-catalog-operator-name">{nombre}</span>
            </span>
          );
        },
        style: { width: '150px' }
      },
      {
        header: 'Avance',
        accessor: (r: ReadingRoute) => {
          if (!r.lecturasEsperadas || r.lecturasEsperadas === 0) {
            return <span style={{ color: 'var(--text-muted)' }}>—</span>;
          }
          const completadas = r.lecturasCompletadas ?? 0;
          const esperadas = r.lecturasEsperadas;
          const pct = Math.min(
            100,
            Math.round((completadas / esperadas) * 100)
          );
          return (
            <div
              className="route-catalog-progress-cell"
              title={`${completadas} de ${esperadas} acometidas leídas (${pct}%)`}
            >
              <div className="route-catalog-progress-bar-bg">
                <div
                  className="route-catalog-progress-bar-fill"
                  style={{
                    width: `${pct}%`,
                    backgroundColor:
                      pct === 100 ? '#10b981' : pct > 0 ? '#3b82f6' : '#94a3b8'
                  }}
                />
              </div>
              <span className="route-catalog-progress-text">
                {completadas}/{esperadas} ({pct}%)
              </span>
            </div>
          );
        },
        style: { width: '130px', textAlign: 'center' }
      },
      {
        header: 'Catálogo',
        accessor: (r: ReadingRoute) => (
          <span
            className={`status-pill ${
              (r.activa === true)
                ? 'status-active'
                : 'status-inactive'
            }`}
          >
            {(r.activa === true) ? 'Activa' : 'Inactiva'}
          </span>
        ),
        style: { width: '90px', textAlign: 'center' }
      },
      {
        header: 'Acciones',
        accessor: (r: ReadingRoute) => {
          const isAssigned = Boolean(
            r.idAsignacion ||
            r.idUsuarioAsignado ||
            (r.estado &&
              r.estado.toUpperCase() !== 'NO_ASIGNADA' &&
              r.estado.toUpperCase() !== 'SIN_ASIGNAR')
          );

          const isCompleted: boolean = r.estado === 'COMPLETADA';

          return (
            <div
              className="route-catalog-actions-cell"
              style={{
                justifyContent: 'center',
                display: 'flex',
                gap: '0.5rem'
              }}
            >
              {!isAssigned && onAssignRoute && (
                <Tooltip
                  content="Asignar esta ruta a un lecturista"
                  followCursor={false}
                  themeColor="info"
                >
                  <Button
                    variant="dashed"
                    onClick={() => onAssignRoute(r)}
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
                    onClick={() => onReassignRoute(r)}
                    leftIcon={<ArrowRightLeft size={13} />}
                    size="xs"
                    color="amber"
                    circle
                    disabled={isCompleted}
                  ></Button>
                </Tooltip>
              )}
              <Tooltip
                content="Ver polígono y centroide en el Visor GIS"
                followCursor={false}
                themeColor="cyan"
              >
                <Button
                  variant="dashed"
                  onClick={() => onViewInMap(r.idRuta)}
                  leftIcon={<MapPin size={13} />}
                  size="xs"
                  color="cyan"
                  circle
                ></Button>
              </Tooltip>
              <Tooltip
                content="Ver listado secuencial de acometidas"
                followCursor={false}
                themeColor="emerald"
              >
                <Button
                  variant="dashed"
                  onClick={() => onInspectRoute(r.idRuta)}
                  leftIcon={<ListOrdered size={13} />}
                  size="xs"
                  color="emerald"
                  circle
                ></Button>
              </Tooltip>
              <Tooltip
                content="Ejecutar reordenamiento óptimo PostGIS TSP"
                followCursor={false}
                themeColor="warning"
              >
                <Button
                  variant="outline"
                  onClick={() => onOptimize(r.idRuta)}
                  leftIcon={<Zap size={13} />}
                  size="xs"
                  color="warning"
                  circle
                ></Button>
              </Tooltip>
            </div>
          );
        },
        style: { width: '280px', textAlign: 'right' }
      }
    ],
    [onAssignRoute, onReassignRoute, onViewInMap, onInspectRoute, onOptimize]
  );

  const sectors = useMemo(() => {
    const set = new Set<number>(DEFAULT_SECTORS.map((s) => s.id));
    (routes || []).forEach((r) => {
      const sec = r?.sectorId ?? r?.sector;
      if (typeof sec === 'number' && Number.isFinite(sec)) {
        set.add(sec);
      }
    });
    if (typeof selectedSector === 'number' && Number.isFinite(selectedSector)) {
      set.add(selectedSector);
    }
    return Array.from(set).sort((a, b) => a - b);
  }, [routes, selectedSector]);

  return (
    <div className="route-catalog-container">
      {/* Search & Filters Bar */}
      <div className="route-catalog-filters-bar">
        <div className="route-catalog-search-wrapper">
          <Search size={16} className="route-catalog-search-icon" />
          <input
            type="text"
            className="route-catalog-search-input"
            placeholder="Buscar por código de ruta o nombre..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="route-catalog-filter-group">
          {/* Filtro de Período Mensual */}
          <div className="route-catalog-filter-item">
            <Calendar size={15} className="route-catalog-filter-icon" />
            <span className="route-catalog-filter-label">Período:</span>
            <Tooltip
              content="Filtrar por período operativo mensual de lectura"
              followCursor={false}
              themeColor="cyan"
            >
              <DatePicker
                value={periodoFilter}
                onChange={(val) => onPeriodoChange(val)}
                size="small"
                view="month"
              />
            </Tooltip>
          </div>

          {/* Filtro de Estado de Asignación */}
          <div className="route-catalog-filter-item">
            <Clock size={15} className="route-catalog-filter-icon" />
            <Tooltip
              content="Filtrar por estado de asignación de la ruta"
              followCursor={false}
              themeColor="cyan"
            >
              <Select
                value={estadoFilter || 'TODOS'}
                onChange={(e) => onEstadoChange(e.target.value)}
                aria-label="Filtrar por estado de asignación"
                size="small"
              >
                <option value="TODOS">Todos los estados</option>
                <option value="NO_ASIGNADA">Sin Asignar (Pendientes)</option>
                <option value="ASIGNADA">Asignadas</option>
                <option value="EN_PROCESO">En Proceso (En campo)</option>
                <option value="PAUSADA">Pausadas</option>
                <option value="COMPLETADA">Completadas</option>
                <option value="REASIGNADA">Reasignadas</option>
              </Select>
            </Tooltip>
          </div>

          {/* Filtro de Sector */}
          <div className="route-catalog-filter-item">
            <Layers size={15} className="route-catalog-filter-icon" />
            <Tooltip
              content="Filtrar por sector hidráulico"
              followCursor={false}
              themeColor="cyan"
            >
              <Select
                size="small"
                value={selectedSector ?? ''}
                onChange={(e) =>
                  onSectorChange(
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                aria-label="Filtrar por sector hidráulico"
              >
                <option value="">Todos los sectores</option>
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    Sector {sec}
                  </option>
                ))}
              </Select>
            </Tooltip>
          </div>

          {/* Filtro de Catálogo (Activa / Inactiva) */}
          <div className="route-catalog-filter-item">
            <Filter size={15} className="route-catalog-filter-icon" />
            <Tooltip
              content="Filtrar por estado del catálogo"
              followCursor={false}
              themeColor="cyan"
            >
              <Select
                size="small"
                value={
                  activaOnly === true
                    ? 'active'
                    : activaOnly === false
                      ? 'inactive'
                      : 'all'
                }
                onChange={(e) =>
                  onActivaChange(
                    e.target.value === 'active'
                      ? true
                      : e.target.value === 'inactive'
                        ? false
                        : undefined
                  )
                }
                aria-label="Filtrar por rutas activas o inactivas"
              >
                <option value="all">Catálogo: Todas</option>
                <option value="active">Catálogo: Activas</option>
                <option value="inactive">Catálogo: Inactivas</option>
              </Select>
            </Tooltip>
          </div>

          {/* Botón Restablecer Filtros */}
          {hasActiveFilters && onResetFilters && (
            <Tooltip
              content="Restablecer todos los filtros"
              followCursor={false}
              themeColor="info"
            >
              <Button
                variant="outline"
                size="xs"
                onClick={onResetFilters}
                leftIcon={<RotateCcw size={13} />}
                className="route-catalog-reset-btn"
              >
                Limpiar
              </Button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Shared Table Component */}
      <div className="route-catalog-table-responsive-wrapper">
        <Table<ReadingRoute>
          data={routes}
          columns={columns}
          isLoading={isLoading}
          pagination={true}
          pageSize={limit}
          serverSidePagination={true}
          totalRecords={totalRoutes}
          currentPage={page}
          onPageChange={onPageChange}
          emptyState={
            <EmptyState
              message="No se encontraron rutas"
              description="Intenta ajustar los filtros de búsqueda, estado, período o sector para ver resultados."
              icon={Compass}
            />
          }
          showColumnModal={true}
          showTotalRecords={true}
          showRowsPerPage={false}
          showFilters={false}
          fullHeight={true}
        />
      </div>
    </div>
  );
};
