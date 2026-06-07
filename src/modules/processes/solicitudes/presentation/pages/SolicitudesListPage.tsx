// ============================================================
// PRESENTATION — SolicitudesListPage
//
// Clean Architecture:
//   Presentation layer only — no business logic here.
//   Orchestrates: Toolbar → Cards → Pagination.
//
// SOLID:
//   SRP: this page only composes sub-components.
//   DIP: reads data via useSolicitudesViewModel (not directly from context).
//   OCP: adding a new feature = extending hooks/components, not this file.
// ============================================================

import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { ReportPreviewModal } from '@/shared/presentation/components/reports/ReportPreviewModal';
import type { ExportColumn } from '@/shared/presentation/components/reports/ReportPreviewModal';
import { ExportService } from '@/shared/infrastructure/services/ExportService';

import type { Solicitud } from '../../domain/models/Solicitud';
import { useSolicitudesViewModel } from '../hooks/useSolicitudesViewModel';
import type { SortKey } from '../hooks/useSolicitudesViewModel';
import {
  getEstadoConfig,
  TIPO_ACOMETIDA_LABELS
} from '../components/SolicitudConfig';

import { SolicitudesToolbar } from '../components/SolicitudesToolbar';
import { SolicitudCard } from '../components/SolicitudCard';
import { SolicitudesPagination } from '../components/SolicitudesPagination';
import '../styles/SolicitudesList.css';

import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';

// ── Singleton export service ───────────────────────────────────────────────
const exportService = new ExportService();

const AVAILABLE_COLUMNS: ExportColumn[] = [
  { id: 'numero', label: 'N° Solicitud', isDefault: true },
  { id: 'titular', label: 'Titular', isDefault: true },
  { id: 'cedula', label: 'Cédula', isDefault: true },
  { id: 'tramite', label: 'Trámite', isDefault: true },
  { id: 'fecha', label: 'Fecha', isDefault: true },
  { id: 'estado', label: 'Estado', isDefault: true },
  { id: 'direccion', label: 'Dirección', isDefault: false }
];

interface SolicitudesListPageProps {
  filter?: 'en_proceso' | 'aprobada' | 'rechazada' | 'completada';
  categoria?: string;
}

export const SolicitudesListPage: React.FC<SolicitudesListPageProps> = ({
  filter,
  categoria
}) => {
  const navigate = useNavigate();
  const { categoria: pathCategoria } = useParams<{ categoria: string }>();
  const activeCategoria = categoria || pathCategoria;

  // ── PDF State ────────────────────────────────────────────────
  const [pdfOpen, setPdfOpen] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'landscape'
  );
  const [selColIds, setSelColIds] = useState<string[]>(
    AVAILABLE_COLUMNS.filter((c) => c.isDefault).map((c) => c.id)
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  // ── View model ───────────────────────────────────────────────
  const {
    solicitudes, // all filtered (for PDF)
    totalCount, // total from context
    paginated, // current page slice
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
    refresh
  } = useSolicitudesViewModel(filter, activeCategoria);

  // ── PDF helpers ───────────────────────────────────────────────
  const buildPdfOptions = useCallback(
    (colIds: string[], orient: 'portrait' | 'landscape') => {
      const colDefs = AVAILABLE_COLUMNS.filter((c) => colIds.includes(c.id));
      return {
        fileName: `solicitudes_${new Date().toISOString().slice(0, 10)}`,
        title: 'Reporte de Solicitudes',
        columns: colDefs.map((c) => c.label),
        rows: solicitudes.map((sol) =>
          colDefs.map((c) => {
            if (c.id === 'numero')
              return sol.solicitudNumero ?? sol.solicitudId;
            if (c.id === 'titular')
              return sol.datosAdicionales?.nombres &&
                sol.datosAdicionales?.apellidos
                ? `${sol.datosAdicionales.nombres} ${sol.datosAdicionales.apellidos}`
                : sol.clienteId;
            if (c.id === 'cedula') return sol.clienteId;
            if (c.id === 'tramite')
              return (
                TIPO_ACOMETIDA_LABELS[sol.tipoAcometida] ?? sol.tipoAcometida
              );
            if (c.id === 'fecha')
              return sol.fechaSolicitud
                ? new Date(sol.fechaSolicitud).toLocaleDateString('es-EC')
                : '—';
            if (c.id === 'estado') return getEstadoConfig(sol.estado).label;
            if (c.id === 'direccion') return sol.direccion ?? '—';
            return String((sol as any)[c.id] ?? '');
          })
        ),
        labelsHorizontal: {
          'Total de registros': String(solicitudes.length),
          'Generado por': 'Sistema EPAA-AA',
          Módulo: 'Nuevas Acometidas'
        },
        orientation: orient
      };
    },
    [solicitudes]
  );

  const handleApplyPreview = useCallback(() => {
    if (solicitudes.length === 0) return;
    setLoadingPdf(true);
    setPdfError(false);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    try {
      setPreviewUrl(
        exportService.generatePdfBlobUrl(
          buildPdfOptions(selColIds, orientation)
        )
      );
    } catch {
      setPdfError(true);
    } finally {
      setLoadingPdf(false);
    }
  }, [buildPdfOptions, selColIds, orientation, solicitudes.length]);

  const handleDownload = useCallback(
    ({
      orientation: o,
      selectedColumnIds
    }: {
      orientation: 'portrait' | 'landscape';
      selectedColumnIds: string[];
    }) => {
      exportService.exportToPdf(buildPdfOptions(selectedColumnIds, o));
    },
    [buildPdfOptions]
  );

  React.useEffect(() => {
    if (!pdfOpen) return;
    handleApplyPreview();
  }, [pdfOpen]); // eslint-disable-line

  React.useEffect(() => {
    if (!pdfOpen) return;
    const t = setTimeout(handleApplyPreview, 350);
    return () => clearTimeout(t);
  }, [selColIds, orientation]); // eslint-disable-line

  // ── Navigate to detail ────────────────────────────────────────
  const handleView = useCallback(
    (id: string) => navigate(`/solicitudes/${id}`),
    [navigate]
  );

  // ── Loading ───────────────────────────────────────────────────
  if (isLoading) {
    return (
      <PageLayout>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5rem 0',
            gap: '1rem'
          }}
        >
          <CircularProgress />
          <span style={{ color: 'var(--text-muted)' }}>
            Cargando solicitudes...
          </span>
        </div>
      </PageLayout>
    );
  }

  // ── Error ─────────────────────────────────────────────────────
  if (error) {
    return (
      <PageLayout>
        <div className="sol-empty">
          <div
            className="sol-empty__icon"
            style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}
          >
            <AlertTriangle size={28} />
          </div>
          <h3>No se pudo cargar la información</h3>
          <p>
            Ocurrió un problema al conectar con el servidor. Por favor intenta
            de nuevo.
          </p>
          <button className="sol-toolbar__btn" onClick={refresh}>
            <RefreshCw size={14} /> Reintentar
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        filters={
          <SolicitudesToolbar
            search={filters.search}
            onSearchChange={(v) => handleFilterChange({ search: v })}
            filterBy={filters.filterBy}
            onFilterByChange={(v) => handleFilterChange({ filterBy: v })}
            event={filters.event}
            onEventChange={(v) => handleFilterChange({ event: v })}
            sortBy={sortBy}
            onSortByChange={(v) => handleSortChange(v as SortKey)}
            totalCount={totalCount}
            filteredCount={solicitudes.length}
            onRefresh={refresh}
            onNuevaSolicitud={() => navigate('/solicitudes/nueva')}
            activeFilter={filter}
          />
        }
        footer={
          <SolicitudesPagination
            page={page}
            pageSize={pageSize}
            total={solicitudes.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        }
      >
        {/* ── Cards list ── */}
        <div className="sol-list-container">
          {paginated.length === 0 ? (
            <div className="sol-empty">
              <div className="sol-empty__icon">
                <Inbox size={28} />
              </div>
              <h3>No hay solicitudes</h3>
              <p>
                {solicitudes.length === 0
                  ? 'No tienes solicitudes registradas. Crea una nueva para comenzar.'
                  : 'No hay resultados con los filtros aplicados.'}
              </p>
              {solicitudes.length > 0 && (
                <button
                  className="sol-toolbar__btn"
                  onClick={() => {
                    handleFilterChange({ search: '', filterBy: '', event: '' });
                  }}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="sol-list">
              {paginated.map((sol: Solicitud, idx: number) => (
                <SolicitudCard
                  key={sol.solicitudId}
                  solicitud={sol}
                  onView={handleView}
                  style={{ animationDelay: `${idx * 0.04}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </PageLayout>

      {/* ── PDF Modal ── */}
      <ReportPreviewModal
        isOpen={pdfOpen}
        onClose={() => {
          setPdfOpen(false);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }}
        onDownload={handleDownload}
        onApply={handleApplyPreview}
        dataCount={solicitudes.length}
        reportTitle="Reporte de Solicitudes"
        availableColumns={AVAILABLE_COLUMNS}
        loadingPreview={loadingPdf}
        previewUrl={previewUrl}
        orientation={orientation}
        setOrientation={setOrientation}
        selectedColumnIds={selColIds}
        setSelectedColumnIds={setSelColIds}
        hasError={pdfError}
      />
    </>
  );
};
