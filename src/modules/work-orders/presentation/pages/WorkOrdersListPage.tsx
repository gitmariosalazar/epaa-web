// ============================================================
// PRESENTATION — WorkOrdersListPage
//
// Clean Architecture:
//   Presentation layer only — no business logic here.
//   Orchestrates: Toolbar → Cards → Pagination.
//
// SOLID:
//   SRP: this page only composes sub-components.
//   DIP: reads data via useWorkOrdersViewModel (not directly from context).
//   OCP: adding a new feature = extending hooks/components, not this file.
// ============================================================

import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';

import { useWorkOrdersViewModel } from '../hooks/useWorkOrdersViewModel';
import type { WorkOrderSortKey } from '../components/WorkOrderToolbar';
import { WorkOrderToolbar } from '../components/WorkOrderToolbar';
import { WorkOrderCard } from '../components/WorkOrderCard';
import { WorkOrderPagination } from '../components/WorkOrderPagination';
import type { OrdenTrabajoVistaCliente } from '../../domain/schemas/dto/response/work-orders.get.response';

import '../styles/WorkOrdersListPage.css';

export const WorkOrdersListPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    ordenes,
    totalCount,
    paginated,
    page,
    pageSize,
    setPage,
    setPageSize,
    isLoading,
    error,
    filters,
    sortBy,
    handleFilterChange,
    handleSortChange,
    refresh,
  } = useWorkOrdersViewModel();

  const handleView = useCallback(
    (codigoOrden: string) => navigate(`/work-orders/${codigoOrden}`),
    [navigate]
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <PageLayout>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 0',
            gap: '1rem',
          }}
        >
          <CircularProgress />
          <span style={{ color: 'var(--text-muted)' }}>Cargando órdenes de trabajo...</span>
        </div>
      </PageLayout>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <PageLayout>
        <div className="wo-empty">
          <div
            className="wo-empty__icon"
            style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
          >
            <AlertTriangle size={28} />
          </div>
          <h3>No se pudo cargar la información</h3>
          <p>Ocurrió un problema al conectar con el servidor. Por favor intenta de nuevo.</p>
          <button className="wo-toolbar__btn" onClick={refresh}>
            <RefreshCw size={14} /> Reintentar
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      filters={
        <WorkOrderToolbar
          filters={filters}
          sortBy={sortBy}
          totalCount={totalCount}
          filteredCount={ordenes.length}
          onFilterChange={handleFilterChange}
          onSortChange={(v) => handleSortChange(v as WorkOrderSortKey)}
          onRefresh={refresh}
        />
      }
      footer={
        <WorkOrderPagination
          page={page}
          pageSize={pageSize}
          total={ordenes.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      }
    >
      <div className="wo-list-container">
        {paginated.length === 0 ? (
          <div className="wo-empty">
            <div className="wo-empty__icon">
              <Inbox size={28} />
            </div>
            <h3>No hay órdenes de trabajo</h3>
            <p>
              {ordenes.length === 0
                ? 'No hay órdenes cargadas. Selecciona una solicitud para ver sus OTs.'
                : 'No hay resultados con los filtros aplicados.'}
            </p>
            {ordenes.length > 0 && (
              <button
                className="wo-toolbar__btn"
                onClick={() =>
                  handleFilterChange({ search: '', estado: '', prioridad: '', tipoOrden: '' })
                }
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="wo-list">
            {paginated.map((orden: OrdenTrabajoVistaCliente, idx: number) => (
              <WorkOrderCard
                key={orden.idOrdenTrabajo}
                orden={orden}
                onView={handleView}
                style={{ animationDelay: `${idx * 0.04}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
