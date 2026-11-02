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
} from 'lucide-react';
import { Table, type Column } from '@/shared/presentation/components/Table/Table';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { Button } from '@/shared/presentation/components/Button/Button';
import type { ReadingRoute } from '../../../domain/models/ReadingRoute';
import { RouteBadge } from '../common/RouteBadge';
import './RouteCatalogTable.css';

interface RouteCatalogTableProps {
  routes: ReadingRoute[];
  isLoading: boolean;
  totalRoutes: number;
  page: number;
  limit: number;
  searchTerm: string;
  selectedSector: number | undefined;
  activaOnly: boolean;
  onSearchChange: (search: string) => void;
  onSectorChange: (sector: number | undefined) => void;
  onActivaChange: (activa: boolean) => void;
  onPageChange: (page: number) => void;
  onViewInMap: (idRuta: number) => void;
  onInspectRoute: (idRuta: number) => void;
  onOptimize: (idRuta: number) => void;
  onAssignRoute?: (route: ReadingRoute) => void;
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
  onSearchChange,
  onSectorChange,
  onActivaChange,
  onPageChange,
  onViewInMap,
  onInspectRoute,
  onOptimize,
  onAssignRoute,
}) => {
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
        style: { width: '100px' },
      },
      {
        header: 'Nombre de la Ruta',
        accessor: (r: ReadingRoute) => (
          <span className="route-catalog-name-cell">
            {r.nombreRuta || r.nombre}
          </span>
        ),
        sortable: true,
        sortKey: 'nombre',
      },
      {
        header: 'Sector',
        accessor: (r: ReadingRoute) => (
          <RouteBadge sector={r.sectorId ?? r.sector} />
        ),
        style: { width: '120px' },
      },
      {
        header: 'Acometidas',
        accessor: (r: ReadingRoute) => (
          <span style={{ fontWeight: 600 }}>{r.cantidadAcometidas ?? 0}</span>
        ),
        isNumeric: true,
        sortable: true,
        sortKey: 'cantidadAcometidas',
        style: { width: '110px', textAlign: 'center' },
      },
      {
        header: 'Tiempo Estimado',
        accessor: (r: ReadingRoute) => (
          <span style={{ color: 'var(--text-secondary)' }}>
            {r.tiempoEstimadoHoras ? `${r.tiempoEstimadoHoras} h` : '—'}
          </span>
        ),
        style: { width: '130px', textAlign: 'center' },
      },
      {
        header: 'Estado',
        accessor: (r: ReadingRoute) => (
          <span
            className={`status-pill ${
              r.activa ?? r.activo ? 'status-active' : 'status-inactive'
            }`}
          >
            {r.activa ?? r.activo ? 'Activa' : 'Inactiva'}
          </span>
        ),
        style: { width: '100px', textAlign: 'center' },
      },
      {
        header: 'Acciones',
        accessor: (r: ReadingRoute) => (
          <div
            className="route-catalog-actions-cell"
            style={{ justifyContent: 'flex-end', display: 'flex', gap: '0.35rem' }}
          >
            {onAssignRoute && (
              <Button
                variant="outline"
                onClick={() => onAssignRoute(r)}
                title="Asignar esta ruta a un lecturista"
                leftIcon={<UserPlus size={13} />}
                size="xs"
              >
                Asignar
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => onViewInMap(r.idRuta)}
              title="Ver polígono y centroide en el Visor GIS"
              leftIcon={<MapPin size={13} />}
              size="xs"
            >
              Mapa
            </Button>
            <Button
              variant="outline"
              onClick={() => onInspectRoute(r.idRuta)}
              title="Ver listado secuencial de acometidas"
              leftIcon={<ListOrdered size={13} />}
              size="xs"
            >
              Acometidas
            </Button>
            <Button
              variant="outline"
              onClick={() => onOptimize(r.idRuta)}
              title="Ejecutar reordenamiento óptimo PostGIS TSP"
              leftIcon={<Zap size={13} />}
              size="xs"
            >
              TSP
            </Button>
          </div>
        ),
        style: { width: '280px', textAlign: 'right' },
      },
    ],
    [onAssignRoute, onViewInMap, onInspectRoute, onOptimize],
  );

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
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        <div className="route-catalog-filter-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Layers size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              className="route-catalog-select"
              value={selectedSector ?? ''}
              onChange={e => onSectorChange(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">Todos los sectores</option>
              <option value="1">Sector 1 (Centro)</option>
              <option value="2">Sector 2 (Andrade Marín)</option>
              <option value="3">Sector 3 (San Roque)</option>
              <option value="4">Sector 4 (Chaltura/Natabuela)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              className="route-catalog-select"
              value={activaOnly ? 'active' : 'all'}
              onChange={e => onActivaChange(e.target.value === 'active')}
            >
              <option value="active">Solo Activas</option>
              <option value="all">Todas (Activas e Inactivas)</option>
            </select>
          </div>
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
              description="Intenta ajustar los filtros de búsqueda o sector para ver resultados."
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
