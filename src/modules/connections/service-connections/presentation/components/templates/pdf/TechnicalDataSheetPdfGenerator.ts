import { pdf } from '@react-pdf/renderer';
import React from 'react';
import type { IPdfDocumentGenerator } from '@/shared/domain/services/IPdfDocumentGenerator';
import { TechnicalDataSheetDocument } from './components/TechnicalDataSheetDocument';
import type { ConnectionWithoutProperty } from '../../../../domain/models/Connection';
import { PreviewFileUseCase } from '@/shared/files/application/usecases/PreviewFileUseCase';
import { FileRepositoryImpl } from '@/shared/files/infrastructure/repositories/FileRepositoryImpl';

const extractFilename = (filePath: string): string => {
  return filePath.split('/').pop() ?? filePath;
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const prepareConnectionsWithPhotos = async (
  connections: ConnectionWithoutProperty[]
): Promise<ConnectionWithoutProperty[]> => {
  const previewUseCase = new PreviewFileUseCase(new FileRepositoryImpl());

  return Promise.all(
    connections.map(async (conn) => {
      const photoFacade = conn.photoFacade
        ? await Promise.all(
            conn.photoFacade.map(async (photo) => {
              if (
                photo.imagePath &&
                !photo.imagePath.startsWith('data:') &&
                !photo.imagePath.startsWith('blob:')
              ) {
                try {
                  const filename = extractFilename(photo.imagePath);
                  const blob = await previewUseCase.execute(
                    'connection_documents',
                    filename
                  );
                  const base64Url = await blobToBase64(blob);
                  return { ...photo, imagePath: base64Url };
                } catch (e) {
                  console.warn(
                    'Could not load facade photo blob for PDF:',
                    photo.imagePath,
                    e
                  );
                }
              }
              return photo;
            })
          )
        : null;

      const photoMeter = conn.photoMeter
        ? await Promise.all(
            conn.photoMeter.map(async (photo) => {
              if (
                photo.imagePath &&
                !photo.imagePath.startsWith('data:') &&
                !photo.imagePath.startsWith('blob:')
              ) {
                try {
                  const filename = extractFilename(photo.imagePath);
                  const blob = await previewUseCase.execute(
                    'connection_documents',
                    filename
                  );
                  const base64Url = await blobToBase64(blob);
                  return { ...photo, imagePath: base64Url };
                } catch (e) {
                  console.warn(
                    'Could not load meter photo blob for PDF:',
                    photo.imagePath,
                    e
                  );
                }
              }
              return photo;
            })
          )
        : null;

      return {
        ...conn,
        photoFacade,
        photoMeter
      };
    })
  );
};

export class TechnicalDataSheetPdfGenerator
  implements IPdfDocumentGenerator<ConnectionWithoutProperty[]>
{
  public async generateBlobUrl(
    connections: ConnectionWithoutProperty[]
  ): Promise<string> {
    const connectionsWithPhotos = await prepareConnectionsWithPhotos(connections);

    // Adapter Pattern: Connecting Domain data with Infrastructure (React-PDF)
    const element = React.createElement(TechnicalDataSheetDocument, {
      connections: connectionsWithPhotos
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
      `Ficha_Tecnica_Acometida_${
        connections.length === 1
          ? connections[0].connectionAccount || connections[0].connectionId
          : 'Global'
      }.pdf`;

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

