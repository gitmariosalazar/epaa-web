import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Input } from '@/shared/presentation/components/Input/Input';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { useAuth } from '@/shared/presentation/context/AuthContext';
import { DocumentPreviewModal } from '@/shared/presentation/components/DocumentPreviewModal';
import { WorkOrderPdfGenerator } from '../components/templates/pdf/WorkOrderPdfGenerator';
import { GetOrdenTrabajoDetalleByNumeroOrdenUseCase } from '../../application/usecases/GetOrdenTrabajoDetalleByNumeroOrdenUseCase';
import { GetOrdenTrabajoTrackingByNumeroOrdenUseCase } from '../../application/usecases/GetOrdenTrabajoTrackingByNumeroOrdenUseCase';
import { ProcessWorkOrderRepositoryImpl } from '../../infrastructure/repositories/ProcessWorkOrderRepositoryImpl';
import type { OrdenTrabajoTracking } from '../../domain/schemas/dto/response/work-orders.get.response';
import { Search, X, Printer } from 'lucide-react';
import '../styles/WorkOrdersProcessPage.css';
import { WorkOrdersProcessPage } from './WorkOrdersProcessPage';
import { FaListUl } from 'react-icons/fa';
import { WorkOrderSelectPopoverModal } from '../components/modals/WorkOrderSelectPopoverModal';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

export const WorkOrderSearchPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const codeParam = searchParams.get('code');

  // ── Repositories & Use Cases ──────────────────────────────────────────────────
  const repo = useMemo(() => new ProcessWorkOrderRepositoryImpl(), []);
  const detalleUseCase = useMemo(
    () => new GetOrdenTrabajoDetalleByNumeroOrdenUseCase(repo),
    [repo]
  );
  const trackingUseCase = useMemo(
    () => new GetOrdenTrabajoTrackingByNumeroOrdenUseCase(repo),
    [repo]
  );

  // ── Search & Selection State ──────────────────────────────────────────────────
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<OrdenTrabajoTracking[]>([]);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // ── Document Preview PDF State ────────────────────────────────────────────────
  const [docPreviewUrl, setDocPreviewUrl] = useState<string | null>(null);
  const [isDocPreviewOpen, setIsDocPreviewOpen] = useState(false);
  const [isGeneratingDocPdf, setIsGeneratingDocPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState<string>('OrdenTrabajo.pdf');

  // Keep the input in sync with the URL
  useEffect(() => {
    if (codeParam) {
      setSearchInput(codeParam);
    } else {
      setSearchInput('');
    }
  }, [codeParam]);

  /**
   * Búsqueda inteligente:
   * - Si retorna 1 resultado: carga automáticamente la OT (navega a ?code=...).
   * - Si retorna > 1 resultados: abre el PopoverModal para que el usuario elija.
   * - Si no hay resultados: notifica al usuario sin romper el estado actual.
   */
  const handleSearch = async () => {
    const term = searchInput.trim().toUpperCase();
    if (!term) return;

    setIsSearching(true);
    try {
      const results = await trackingUseCase.execute(term);

      if (!results || results.length === 0) {
        MessageToastCustom(
          'warning',
          'Sin resultados',
          `No se encontraron órdenes de trabajo para: "${term}".`
        );
        setSearchResults([]);
        setIsSelectModalOpen(false);
        return;
      }

      if (results.length === 1) {
        // Exactamente 1 resultado: carga automática inmediata
        const singleOrder = results[0];
        setSearchResults(results);
        setIsSelectModalOpen(false);
        setSearchInput(singleOrder.codigoOrden);
        navigate(`/work-orders/search?code=${encodeURIComponent(singleOrder.codigoOrden)}`);
      } else {
        // Múltiples resultados: abrir PopoverModal para selección
        setSearchResults(results);
        setIsSelectModalOpen(true);
      }
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error de Búsqueda',
        e.message || 'No se pudo buscar la orden de trabajo.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectOrder = (order: OrdenTrabajoTracking) => {
    setSearchInput(order.codigoOrden);
    setIsSelectModalOpen(false);
    navigate(`/work-orders/search?code=${encodeURIComponent(order.codigoOrden)}`);
  };

  const handleClear = () => {
    setSearchInput('');
    setSearchResults([]);
    setIsSelectModalOpen(false);
    navigate(`/work-orders/search`);
  };

  const handlePrintWorkOrderPdf = useCallback(async () => {
    if (!codeParam) return;
    setIsGeneratingDocPdf(true);
    setIsDocPreviewOpen(true);
    try {
      const detail = await detalleUseCase.execute(codeParam);
      const printedBy = user?.username || user?.cardId || '-';
      const inputData = detail ? { ...detail, printedBy } : { printedBy };
      const generator = new WorkOrderPdfGenerator();
      const url = await generator.generateBlobUrl([inputData as any]);
      setDocPreviewUrl(url);
      setPdfFileName(`OrdenTrabajo_${codeParam}.pdf`);
    } catch (e: any) {
      MessageToastCustom(
        'error',
        'Error al generar PDF',
        e.message || 'No se pudo generar el PDF de la orden de trabajo.'
      );
      setIsDocPreviewOpen(false);
    } finally {
      setIsGeneratingDocPdf(false);
    }
  }, [codeParam, detalleUseCase, user]);

  const handleCloseDocPreview = useCallback(() => {
    if (docPreviewUrl) {
      URL.revokeObjectURL(docPreviewUrl);
    }
    setDocPreviewUrl(null);
    setIsDocPreviewOpen(false);
  }, [docPreviewUrl]);

  return (
    <PageLayout
      header={
        <div className="wo-process-header">
          <div className="wo-process-header__info">
            <h2 className="wo-process-header__title">Buscar Orden de Trabajo</h2>
            <p className="wo-process-header__subtitle">
              Encuentra una OT por código, cédula o clave catastral para procesarla
            </p>
          </div>
          <div className="wo-process-search" ref={searchContainerRef}>
            <Input
              id="wo-process-search-input"
              width={'350px'}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isSearching && handleSearch()}
              placeholder="Código OT, Cédula o Clave Catastral"
              autoComplete="off"
              leftIcon={<Search size={14} />}
              size="small"
              disabled={isSearching}
            />
            <Button
              id="wo-process-search-btn"
              onClick={handleSearch}
              variant="primary"
              leftIcon={<Search size={14} />}
              disabled={!searchInput.trim() || isSearching}
              isLoading={isSearching}
              size="xs"
            >
              Buscar
            </Button>
            <Tooltip
              content={
                searchResults.length > 1
                  ? `Ver ${searchResults.length} resultados encontrados`
                  : 'Buscar órdenes'
              }
              position="top"
              followCursor={false}
            >
              <Button
                id="wo-process-search-list-btn"
                onClick={() => {
                  if (searchResults.length > 1) {
                    setIsSelectModalOpen(true);
                  } else {
                    handleSearch();
                  }
                }}
                variant="secondary"
                leftIcon={<FaListUl size={14} />}
                disabled={(!searchInput.trim() || isSearching) || searchResults.length <= 1}
                iconOnly
                size="xs"
              />
            </Tooltip>
            {codeParam && (
              <>
                <Button
                  variant="dashed"
                  color="warning"
                  size="xs"
                  leftIcon={<X size={14} />}
                  onClick={handleClear}
                >
                  Limpiar
                </Button>
                <Button
                  variant="dashed"
                  size="xs"
                  leftIcon={<Printer size={14} />}
                  onClick={handlePrintWorkOrderPdf}
                >
                  Imprimir Orden de Trabajo
                </Button>
              </>
            )}
          </div>
        </div>
      }
    >
      {!codeParam ? (
        <div className="wo-process-empty">
          <EmptyState
            icon={
              <div className="wo-process-empty__icon">
                <Search size={48} opacity={0.3} />
              </div>
            }
            message="Ingresa un código de OT para procesarla"
            description="Escribe el código de la orden (Ej: OT-2026-0000001), cédula (Ej: 1714396134001) o clave catastral (Ej: 10-100) y presiona Buscar"
          />
        </div>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <WorkOrdersProcessPage isEmbedded={true} />
        </div>
      )}

      {/* ── Selection Popover Modal (cuando hay múltiples resultados) ── */}
      <WorkOrderSelectPopoverModal
        isOpen={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        orders={searchResults}
        onSelect={handleSelectOrder}
        anchorElement={searchContainerRef.current}
      />

      {/* ── Document Preview Modal ── */}
      <DocumentPreviewModal
        isOpen={isDocPreviewOpen}
        onClose={handleCloseDocPreview}
        documentUrl={docPreviewUrl}
        isLoading={isGeneratingDocPdf}
        title="Vista Previa - Orden de Trabajo"
        fileName={pdfFileName}
      />
    </PageLayout>
  );
};
