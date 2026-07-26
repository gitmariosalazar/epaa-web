import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { WorkOrderRepositoryImpl } from '@/modules/processes/solicitudes/infrastructure/repositories/WorkOrderRepositoryImpl';
import { SolicitudRepositoryImpl } from '@/modules/processes/solicitudes/infrastructure/repositories/SolicitudRepositoryImpl';
import { ReportInspectionWorkOrderPdf } from '../templates/pdf/ReportInspectionWorkOrderPdf';
import { ReportInstallationWorkOrderPdf } from '../templates/pdf/ReportInstallationWorkOrderPdf';

interface PreviewReportInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipoOrden: string;
  orderCode: string;
}

export const PreviewReportInspectionModal: React.FC<PreviewReportInspectionModalProps> = ({
  isOpen,
  onClose,
  tipoOrden,
  orderCode
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<
    | { type: 'INSPECCION'; data: import('../../../domain/dto/WorkOrderReportResponse').InspectionReportResponse; client: import('../../../domain/models/Solicitud').RequestDetailByClientResponse }
    | { type: 'INSTALACION'; data: import('../../../domain/dto/WorkOrderReportResponse').InstallationReportResponse; client: import('../../../domain/models/Solicitud').RequestDetailByClientResponse }
    | null
  >(null);

  const repository = useMemo(() => new WorkOrderRepositoryImpl(), []);
  const solicitudRepository = useMemo(() => new SolicitudRepositoryImpl(), []);

  // Instanciar estrategias
  const inspectionGenerator = useMemo(() => new ReportInspectionWorkOrderPdf(), []);
  const installationGenerator = useMemo(() => new ReportInstallationWorkOrderPdf(), []);


  const loadReport = useCallback(async () => {
    if (!orderCode || !tipoOrden) return;

    setLoading(true);
    setError(null);
    setPreviewUrl(null);

    try {
      if (tipoOrden === 'INSPECCION') {
        const data = await repository.getWorkOrderInspectionDetailByOrderCodeOrRequestNumber(orderCode);
        if (!data) throw new Error('No se encontró el reporte de inspección');
        
        let requestByClient = null;
        if (data.request?.requestNumber) {
          requestByClient = await solicitudRepository.getRequestDetailByRequestIdOrNumber(data.request.requestNumber);
        }
        if (!requestByClient) throw new Error('No se encontró el detalle de la solicitud del cliente');

        setFetchedData({ type: 'INSPECCION', data, client: requestByClient });
        const url = await Promise.resolve(inspectionGenerator.generateBlobUrl(data, requestByClient));
        setPreviewUrl(url);
      } else if (tipoOrden === 'INSTALACION') {
        const data = await repository.getWorkOrderInstallationDetailByOrderCodeOrRequestNumber(orderCode);
        if (!data) throw new Error('No se encontró el reporte de instalación');
        
        let requestByClient = null;
        if (data.request?.requestNumber) {
          requestByClient = await solicitudRepository.getRequestDetailByRequestIdOrNumber(data.request.requestNumber);
        }
        if (!requestByClient) throw new Error('No se encontró el detalle de la solicitud del cliente');

        setFetchedData({ type: 'INSTALACION', data, client: requestByClient });
        const url = await Promise.resolve(installationGenerator.generateBlobUrl(data, requestByClient));
        setPreviewUrl(url);
      } else {
        throw new Error(`El tipo de orden ${tipoOrden} no tiene un reporte PDF configurado.`);
      }
    } catch (err: unknown) {
      console.error('Error fetching report', err);
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar el reporte';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [orderCode, tipoOrden, repository, solicitudRepository, inspectionGenerator, installationGenerator]);

  useEffect(() => {
    if (isOpen) {
      loadReport();
    } else {
      // Cleanup
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setFetchedData(null);
    }
  }, [isOpen, loadReport]);

  const handleDownload = () => {
    if (!fetchedData) return;
    if (fetchedData.type === 'INSPECCION') {
      inspectionGenerator.downloadPdf(fetchedData.data, fetchedData.client);
    } else if (fetchedData.type === 'INSTALACION') {
      installationGenerator.downloadPdf(fetchedData.data, fetchedData.client);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Vista Previa del Informe de: ${tipoOrden}`} size="xl"
      description={`Visualización del informe de ${tipoOrden}. Puede descargarlo para su uso posterior.`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '70vh', gap: '1rem' }}>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column', gap: '10px' }}>
            <Loader2 className="animate-spin text-accent" size={32} />
            <span style={{ color: 'var(--text-secondary)' }}>Cargando información del reporte...</span>
          </div>
        )}

        {!loading && error && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column', gap: '10px', color: 'var(--error)' }}>
            <AlertCircle size={32} />
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={loadReport} color="primary">Reintentar</Button>
          </div>
        )}

        {!loading && previewUrl && (
          <iframe
            src={`${previewUrl}#toolbar=0&view=FitH`}
            title="PDF Preview"
            style={{ width: '100%', height: '100%', border: '1px solid var(--border)', borderRadius: '8px' }}
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
          <Button variant="outline" onClick={onClose} color="error">Cancelar</Button>
          <Button
            leftIcon={<Download size={16} />}
            onClick={handleDownload}
            disabled={!previewUrl || loading}
            color="primary"
          >
            Descargar PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};