import { pdf } from '@react-pdf/renderer';
import React from 'react';
import type { IPdfDocumentGenerator } from '@/shared/domain/services/IPdfDocumentGenerator';
import type { ClientPendingBillGroup } from '../../../hooks/pending-readings/useClientPendingBills';
import { ClientPendingBillsDocument } from './components/ClientPendingBillsDocument';

export class ClientPendingBillsPdfGenerator implements IPdfDocumentGenerator<ClientPendingBillGroup[]> {
  public async generateBlobUrl(
    groups: ClientPendingBillGroup[]
  ): Promise<string> {
    // Adapter Pattern: Connecting Domain data with Infrastructure (React-PDF)
    const element = React.createElement(ClientPendingBillsDocument, {
      groups,
    }) as React.ReactElement<any>;

    // Render asynchronously to Blob
    const blob = await pdf(element).toBlob();
    return URL.createObjectURL(blob);
  }

  public async downloadPdf(
    groups: ClientPendingBillGroup[],
    fileName?: string
  ): Promise<void> {
    const blobUrl = await this.generateBlobUrl(groups);
    const finalName = fileName || `Planillas_Completas_${groups.length === 1 ? groups[0].cadastralKey : 'Global'}.pdf`;

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
