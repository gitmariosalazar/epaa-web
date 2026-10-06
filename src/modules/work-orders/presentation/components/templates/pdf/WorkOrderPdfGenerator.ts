import { pdf } from '@react-pdf/renderer';
import React from 'react';
import type { IPdfDocumentGenerator } from '@/shared/domain/services/IPdfDocumentGenerator';
import {
  WorkOrderDocument,
  type WorkOrderInputData
} from './components/WorkOrderDocument';

/**
 * WorkOrderPdfGenerator — Concrete implementation of IPdfDocumentGenerator
 * for Work Orders (Ordenes de Trabajo).
 *
 * Clean Architecture (Adapter Pattern):
 * Connects domain objects with infrastructure (@react-pdf/renderer).
 *
 * SOLID Principles:
 * - Single Responsibility Principle (SRP): Only handles rendering & downloading work order PDFs.
 * - Open/Closed Principle (OCP): Can handle different input types (WorkOrderPdfItem, OrdenTrabajoDetalle, WorkOrderListItem).
 * - Liskov Substitution Principle (LSP) & Dependency Inversion Principle (DIP): Implements IPdfDocumentGenerator interface.
 */
export class WorkOrderPdfGenerator implements IPdfDocumentGenerator<WorkOrderInputData[]> {
  /**
   * Asynchronously renders the Work Order PDF template to a Blob URL.
   */
  public async generateBlobUrl(items: WorkOrderInputData[]): Promise<string> {
    const element = React.createElement(WorkOrderDocument, {
      items
    }) as React.ReactElement<any>;

    const blob = await pdf(element).toBlob();
    return URL.createObjectURL(blob);
  }

  /**
   * Generates and downloads the Work Order PDF directly to the user's browser.
   */
  public async downloadPdf(
    items: WorkOrderInputData[],
    fileName?: string
  ): Promise<void> {
    const blobUrl = await this.generateBlobUrl(items);

    let defaultName = 'Orden_de_Trabajo.pdf';
    if (items && items.length === 1) {
      const first = items[0];
      const code = 'orderCode' in first ? first.orderCode : ('codigoOrden' in first ? first.codigoOrden : '70254');
      defaultName = `Orden_de_Trabajo_${code}.pdf`;
    } else if (items && items.length > 1) {
      defaultName = 'Ordenes_de_Trabajo_Lote.pdf';
    }

    const finalName = fileName || defaultName;

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
