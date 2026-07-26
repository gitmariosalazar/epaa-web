import { pdf } from '@react-pdf/renderer';
import React from 'react';
import type { IPdfDocumentGenerator } from '@/shared/domain/services/IPdfDocumentGenerator';
import type { InspectionReportResponse } from '../../../../domain/dto/WorkOrderReportResponse';
import { InspectionReportDocument } from './components/InspectionReportDocument';
import type { RequestDetailByClientResponse } from '@/modules/processes/solicitudes/domain/models/Solicitud';

export class ReportInspectionWorkOrderPdf implements IPdfDocumentGenerator<InspectionReportResponse, RequestDetailByClientResponse> {
  public async generateBlobUrl(
    inspectionReport: InspectionReportResponse,
    requestByClient: RequestDetailByClientResponse
  ): Promise<string> {
    // Patrón Adaptador: Conectamos la data de Dominio con el motor de Infraestructura (React-PDF)
    const element = React.createElement(InspectionReportDocument, {
      inspectionReport,
      requestByClient
    }) as React.ReactElement<any>;

    // Renderizamos de forma asíncrona a un Blob en memoria
    const blob = await pdf(element).toBlob();
    return URL.createObjectURL(blob);
  }

  public async downloadPdf(
    inspectionReport: InspectionReportResponse,
    requestByClient: RequestDetailByClientResponse
  ): Promise<void> {
    const blobUrl = await this.generateBlobUrl(inspectionReport, requestByClient);
    const fileName = `informe_inspeccion_${inspectionReport.request?.requestNumber || inspectionReport.id}.pdf`;

    // Trigger download programmatically
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }
}
