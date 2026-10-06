// ============================================================
// PRESENTATION — AllWorkOrdersListPage
//
// Clean Architecture:
//   Presentation layer only — no business logic here.
//   Orchestrates: Toolbar → Cards → Pagination.
//
// SOLID:
//   SRP : this page only composes sub-components.
//   DIP : reads data via useAllWorkOrdersViewModel.
//   OCP : adding a new feature = extending hooks/components, not this file.
// ============================================================
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { ReportPreviewModal } from '@/shared/presentation/components/reports/ReportPreviewModal';
import type { ExportColumn } from '@/shared/presentation/components/reports/ReportPreviewModal';
import { DocumentPreviewModal } from '@/shared/presentation/components/DocumentPreviewModal';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import { WorkOrderPdfGenerator } from '../components/templates/pdf/WorkOrderPdfGenerator';
import type { OrdenTrabajoDetalle, WorkOrderListItem } from '../../domain/schemas/dto/response/work-orders.get.response';
import { GetOrdenTrabajoDetalleByNumeroOrdenUseCase } from '../../application/usecases/GetOrdenTrabajoDetalleByNumeroOrdenUseCase';
import { ProcessWorkOrderRepositoryImpl } from '../../infrastructure/repositories/ProcessWorkOrderRepositoryImpl';
import { useAllWorkOrdersViewModel, type AllWorkOrderSortKey } from '../hooks/useAllWorkOrdersViewModel';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { AllWorkOrderToolbar } from '../components/AllWorkOrderToolbar';
import { AllWorkOrderCard } from '../components/AllWorkOrderCard';
import { WorkOrderPagination } from '../components/WorkOrderPagination';

import '../styles/WorkOrdersListPage.css';

// ── Export config ─────────────────────────────────────────────────────────────
const exportService = new ExportService();

const AVAILABLE_COLUMNS: ExportColumn[] = [
  { id: 'codigo', label: 'Código OT', isDefault: true },
  { id: 'cliente', label: 'Cliente', isDefault: true },
  { id: 'cedula', label: 'Cédula / RUC', isDefault: true },
  { id: 'tipo', label: 'Tipo de Trabajo', isDefault: true },
  { id: 'origen', label: 'Origen', isDefault: false },
  { id: 'prioridad', label: 'Prioridad', isDefault: true },
  { id: 'estado', label: 'Estado', isDefault: true },
  { id: 'fecha', label: 'Fecha creación', isDefault: true },
  { id: 'direccion', label: 'Dirección', isDefault: false }
];

// ─────────────────────────────────────────────────────────────────────────────
export const AllWorkOrdersListPage: React.FC = () => {
  const navigate = useNavigate();

  // ── PDF state ────────────────────────────────────────────────────────────
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

  // ── Document PDF preview state (Single Work Order template) ──
  const [docPreviewUrl, setDocPreviewUrl] = useState<string | null>(null);
  const [isDocPreviewOpen, setIsDocPreviewOpen] = useState(false);
  const [isGeneratingDocPdf, setIsGeneratingDocPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState<string>('Orden_de_Trabajo.pdf');

  // DIP: Inject GetOrdenTrabajoDetalleByNumeroOrdenUseCase via useMemo
  const getOrdenTrabajoDetalleUseCase = useMemo(
    () => new GetOrdenTrabajoDetalleByNumeroOrdenUseCase(new ProcessWorkOrderRepositoryImpl()),
    []
  );

  const { user } = useAuth();

  const handlePrintWorkOrderPdf = useCallback(async (orden: WorkOrderListItem) => {
    setIsDocPreviewOpen(true);
    setIsGeneratingDocPdf(true);
    setPdfFileName(`Orden_de_Trabajo_${orden.orderCode}.pdf`);
    try {
      // 1. Obtener la OrdenTrabajoDetalle completa mediante el Caso de Uso (Clean Architecture)
      const detalle: OrdenTrabajoDetalle | null | undefined = await getOrdenTrabajoDetalleUseCase.execute(orden.orderCode);
      console.warn('📌 [ORDEN DE TRABAJO DETALLE OBTENIDA]:', detalle);

      const printedBy = user?.username || 'solanoa';

      // 2. Generar el PDF con el detalle completo y el usuario logueado como printedBy
      const inputData = detalle ? { ...detalle, printedBy } : { ...orden, printedBy };
      const generator = new WorkOrderPdfGenerator();
      const url = await generator.generateBlobUrl([inputData]);
      setDocPreviewUrl(url);
    } catch (err) {
      console.error('Error al obtener detalle o generar PDF de la Orden de Trabajo:', err);
    } finally {
      setIsGeneratingDocPdf(false);
    }
  }, [getOrdenTrabajoDetalleUseCase, user]);

  const handleCloseDocPreview = useCallback(() => {
    setIsDocPreviewOpen(false);
    setTimeout(() => {
      if (docPreviewUrl) {
        URL.revokeObjectURL(docPreviewUrl);
        setDocPreviewUrl(null);
      }
    }, 300);
  }, [docPreviewUrl]);

  // ── ViewModel ────────────────────────────────────────────────────────────
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
    refresh
  } = useAllWorkOrdersViewModel();

  // ── PDF helpers ───────────────────────────────────────────────────────────
  const buildPdfOptions = useCallback(
    (colIds: string[], orient: 'portrait' | 'landscape') => {
      const colDefs = AVAILABLE_COLUMNS.filter((c) => colIds.includes(c.id));
      return {
        fileName: `ordenes_trabajo_${new Date().toISOString().slice(0, 10)}`,
        title: 'Reporte de Órdenes de Trabajo',
        columns: colDefs.map((c) => c.label),
        rows: ordenes.map((o) =>
          colDefs.map((c) => {
            if (c.id === 'codigo') return o.orderCode;
            if (c.id === 'cliente') return o.clientName;
            if (c.id === 'cedula') return o.clientId;
            if (c.id === 'tipo') return o.workTypeName;
            if (c.id === 'origen') return o.origin;
            if (c.id === 'prioridad') return String(o.priorityId);
            if (c.id === 'estado') return o.status;
            if (c.id === 'fecha')
              return o.creationDate
                ? new Date(o.creationDate).toLocaleDateString('es-EC')
                : '—';
            if (c.id === 'direccion') return o.location ?? '—';
            return '';
          })
        ),
        labelsHorizontal: {
          'Total de registros': String(ordenes.length),
          'Generado por': 'Sistema EPAA-AA',
          Módulo: 'Órdenes de Trabajo'
        },
        orientation: orient
      };
    },
    [ordenes]
  );

  const handleApplyPreview = useCallback(() => {
    if (ordenes.length === 0) return;
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
  }, [buildPdfOptions, selColIds, orientation, ordenes.length]);

  const handleDownload = useCallback(
    ({
      orientation: o,
      selectedColumnIds
    }: {
      orientation: 'portrait' | 'landscape';
      selectedColumnIds: string[];
    }) => exportService.exportToPdf(buildPdfOptions(selectedColumnIds, o)),
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

  // ── Navigate to detail ────────────────────────────────────────────────────
  const handleView = useCallback(
    (orderCode: string) => navigate(`/work-orders/${orderCode}`),
    [navigate]
  );

  const handleProcess = useCallback(
    (orderCode: string) =>
      navigate(`/work-orders/process?code=${encodeURIComponent(orderCode)}`),
    [navigate]
  );

  // ── Loading ───────────────────────────────────────────────────────────────
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
            Cargando órdenes de trabajo...
          </span>
        </div>
      </PageLayout>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <PageLayout>
        <div className="wo-empty">
          <div
            className="wo-empty__icon"
            style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)' }}
          >
            <AlertTriangle size={28} />
          </div>
          <h3>No se pudo cargar la información</h3>
          <p>
            Ocurrió un problema al conectar con el servidor. Por favor intenta
            de nuevo.
          </p>
          <button className="wo-toolbar__btn" onClick={refresh}>
            <RefreshCw size={14} /> Reintentar
          </button>
        </div>
      </PageLayout>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <PageLayout
        filters={
          <AllWorkOrderToolbar
            filters={filters}
            sortBy={sortBy}
            totalCount={totalCount}
            filteredCount={ordenes.length}
            onFilterChange={handleFilterChange}
            onSortChange={(v) => handleSortChange(v as AllWorkOrderSortKey)}
            onRefresh={refresh}
            onNuevaOT={() => navigate('/work-orders/create')}
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
                  ? 'No se encontraron órdenes en el sistema.'
                  : 'No hay resultados con los filtros aplicados.'}
              </p>
              {ordenes.length > 0 && (
                <button
                  className="wo-toolbar__btn"
                  onClick={() =>
                    handleFilterChange({
                      search: '',
                      status: '',
                      priority: '',
                      origin: '',
                      filterBy: ''
                    })
                  }
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="wo-list">
              {paginated.map((orden, idx) => (
                <AllWorkOrderCard
                  key={orden.workOrderId}
                  orden={orden}
                  onView={handleView}
                  onProcess={handleProcess}
                  onPrintPdf={handlePrintWorkOrderPdf}
                  style={{ animationDelay: `${idx * 0.04}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </PageLayout>

      {/* ── Table Export PDF Modal ── */}
      <ReportPreviewModal
        isOpen={pdfOpen}
        onClose={() => {
          setPdfOpen(false);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }}
        onDownload={handleDownload}
        onApply={handleApplyPreview}
        dataCount={ordenes.length}
        reportTitle="Reporte de Órdenes de Trabajo"
        availableColumns={AVAILABLE_COLUMNS}
        loadingPreview={loadingPdf}
        previewUrl={previewUrl}
        orientation={orientation}
        setOrientation={setOrientation}
        selectedColumnIds={selColIds}
        setSelectedColumnIds={setSelColIds}
        hasError={pdfError}
      />

      {/* ── Individual Work Order Document PDF Modal ── */}
      <DocumentPreviewModal
        isOpen={isDocPreviewOpen}
        onClose={handleCloseDocPreview}
        documentUrl={docPreviewUrl}
        isLoading={isGeneratingDocPdf}
        title="Vista Previa - Orden de Trabajo"
        fileName={pdfFileName}
      />
    </>
  );
};
