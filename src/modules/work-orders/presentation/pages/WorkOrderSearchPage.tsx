import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { ProcessWorkOrderRepositoryImpl } from '../../infrastructure/repositories/ProcessWorkOrderRepositoryImpl';
import { Search, X, Printer } from 'lucide-react';
import '../styles/WorkOrdersProcessPage.css';
import { WorkOrdersProcessPage } from './WorkOrdersProcessPage';

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

  const handleSearch = () => {
    const code = searchInput.trim().toUpperCase();
    if (!code) return;
    navigate(`/work-orders/search?code=${encodeURIComponent(code)}`);
  };

  const handleClear = () => {
    setSearchInput('');
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
            <p className="wo-process-header__subtitle">Encuentra una OT por código para procesarla</p>
          </div>
          <div className="wo-process-search">
            <Input
              id="wo-process-search-input"
              width={'350px'}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Código OT — Ej: OT-2026-0000001"
              autoComplete="off"
              leftIcon={<Search size={14} />}
              size="small"
            />
            <Button
              id="wo-process-search-btn"
              onClick={handleSearch}
              variant="primary"
              leftIcon={<Search size={14} />}
              disabled={!searchInput.trim()}
              size="xs"
            >
              Buscar
            </Button>
            {codeParam && (
              <>
                <Button
                  variant="dashed"
                  color='warning'
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
            icon={<div className="wo-process-empty__icon"><Search size={48} opacity={0.3} /></div>}
            message="Ingresa un código de OT para procesarla"
            description="Escribe el código de la orden (Ej: OT-2026-0000001) y presiona Buscar para iniciar el proceso"
          />
        </div>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <WorkOrdersProcessPage isEmbedded={true} />
        </div>
      )}

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
