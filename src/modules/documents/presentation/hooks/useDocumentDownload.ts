import { useState, useCallback } from 'react';
import { DownloadDocumentUseCase } from '../../application/usecases/DownloadDocumentUseCase';
import { DocumentRepositoryImpl } from '../../infrastructure/repositories/DocumentRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

/**
 * Singleton use case instance: created once at module level.
 */
const downloadUseCase = new DownloadDocumentUseCase(new DocumentRepositoryImpl());

/**
 * Derives a file extension from a MIME type.
 * Returns an empty string for unknown types.
 */
function extensionFromMimeType(mimeType?: string | null): string {
  switch ((mimeType || '').toLowerCase()) {
    case 'application/pdf': return '.pdf';
    case 'image/png':       return '.png';
    case 'image/jpeg':      return '.jpg';
    case 'image/webp':      return '.webp';
    case 'image/gif':       return '.gif';
    case 'text/plain':      return '.txt';
    default:                return '';
  }
}

export interface UseDocumentDownloadResult {
  /**
   * Triggers a file download.
   * @param documentId - Preferred: unique document ID.
   * @param documentUrl - Fallback: direct document URL.
   * @param filename - Desired filename without extension (extension auto-derived from MIME).
   */
  download: (
    documentId?: string,
    documentUrl?: string,
    filename?: string
  ) => Promise<void>;
  /** True while the download is in progress. */
  isDownloading: boolean;
}

/**
 * useDocumentDownload
 *
 * Custom hook that encapsulates the "download file to disk" behavior:
 * fetching the blob, creating a temporary anchor element, clicking it,
 * and cleaning up the object URL afterward.
 *
 * SRP: single responsibility — trigger browser file download.
 * DIP: depends on DownloadDocumentUseCase (application abstraction).
 *
 * The download function is memoized via useCallback to keep referential
 * stability across renders.
 */
export function useDocumentDownload(): UseDocumentDownloadResult {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = useCallback(
    async (
      documentId?: string,
      documentUrl?: string,
      filename = 'Documento'
    ): Promise<void> => {
      if (isDownloading) return;

      setIsDownloading(true);
      try {
        const blob = await downloadUseCase.execute(documentId, documentUrl);
        const objectUrl = URL.createObjectURL(blob);

        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = `${filename}${extensionFromMimeType(blob.type)}`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        URL.revokeObjectURL(objectUrl);
      } catch (err) {
        console.error('[useDocumentDownload] Error downloading document:', err);
        MessageToastCustom('error', 'Error', 'No se pudo descargar el archivo.');
      } finally {
        setIsDownloading(false);
      }
    },
    [isDownloading]
  );

  return { download, isDownloading };
}
