import { pdf } from '@react-pdf/renderer';
import React from 'react';
import type { IPdfDocumentGenerator } from '@/shared/domain/services/IPdfDocumentGenerator';
import { TechnicalDataSheetDocument } from './components/TechnicalDataSheetDocument';
import type { ConnectionWithoutProperty } from '../../../../domain/models/Connection';

export class TechnicalDataSheetPdfGenerator implements IPdfDocumentGenerator<
  ConnectionWithoutProperty[]
> {
  public async generateBlobUrl(
    connections: ConnectionWithoutProperty[]
  ): Promise<string> {
    // Adapter Pattern: Connecting Domain data with Infrastructure (React-PDF)
    const element = React.createElement(TechnicalDataSheetDocument, {
      connections
    }) as React.ReactElement<any>;

    // Render asynchronously to Blob
    const blob = await pdf(element).toBlob();
    return URL.createObjectURL(blob);
  }

  public async downloadPdf(
    connections: ConnectionWithoutProperty[],
    fileName?: string
  ): Promise<void> {
    const blobUrl = await this.generateBlobUrl(connections);
    const finalName =
      fileName ||
      `Ficha_Tecnica_Acometida_${connections.length === 1 ? connections[0].connectionAccount || connections[0].connectionId : 'Global'}.pdf`;

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
