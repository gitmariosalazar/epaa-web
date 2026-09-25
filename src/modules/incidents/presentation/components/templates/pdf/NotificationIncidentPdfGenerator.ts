import { pdf } from '@react-pdf/renderer';
import React from 'react';
import type { IPdfDocumentGenerator } from '@/shared/domain/services/IPdfDocumentGenerator';
import {
  NotificationIncidentDocument,
  type NotificationIncidentItem
} from './components/NotificationIncidentDocument';

export class NotificationIncidentPdfGenerator implements IPdfDocumentGenerator<
  NotificationIncidentItem[]
> {
  public async generateBlobUrl(
    items: NotificationIncidentItem[]
  ): Promise<string> {
    // Adapter Pattern: Connecting Domain data with Infrastructure (React-PDF)
    const element = React.createElement(NotificationIncidentDocument, {
      items
    }) as React.ReactElement<any>;

    // Render asynchronously to Blob
    const blob = await pdf(element).toBlob();
    return URL.createObjectURL(blob);
  }

  public async downloadPdf(
    items: NotificationIncidentItem[],
    fileName?: string
  ): Promise<void> {
    const blobUrl = await this.generateBlobUrl(items);
    const finalName =
      fileName ||
      `Notificacion_Clandestina_${items.length === 1 ? items[0].incident.incidentCode : 'Global'}.pdf`;

    // Trigger download programmatically
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = finalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }
}
