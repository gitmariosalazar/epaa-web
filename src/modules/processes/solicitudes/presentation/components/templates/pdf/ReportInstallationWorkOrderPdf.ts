import { pdf } from '@react-pdf/renderer';
import React from 'react';
import type { IPdfDocumentGenerator } from '@/shared/domain/services/IPdfDocumentGenerator';
import type { InstallationReportResponse } from '../../../../domain/dto/WorkOrderReportResponse';
import { InstallationReportDocument } from './components/InstallationReportDocument';
import type { RequestDetailByClientResponse } from '@/modules/processes/solicitudes/domain/models/Solicitud';

export class ReportInstallationWorkOrderPdf implements IPdfDocumentGenerator<InstallationReportResponse, RequestDetailByClientResponse> {
  public async generateBlobUrl(
    installationReport: InstallationReportResponse,
    requestByClient: RequestDetailByClientResponse
  ): Promise<string> {
    // Patrón Adaptador: Conectamos la data de Dominio con el motor de Infraestructura (React-PDF)
    const element = React.createElement(InstallationReportDocument, {
      installationReport,
      requestByClient
    }) as React.ReactElement<any>;

    // Renderizamos de forma asíncrona a un Blob en memoria
    const blob = await pdf(element).toBlob();
    return URL.createObjectURL(blob);
  }

  public async downloadPdf(
    installationReport: InstallationReportResponse,
    requestByClient: RequestDetailByClientResponse
  ): Promise<void> {
    const blobUrl = await this.generateBlobUrl(installationReport, requestByClient);
    const fileName = `informe_instalacion_${installationReport.request?.requestNumber || installationReport.id}.pdf`;

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
