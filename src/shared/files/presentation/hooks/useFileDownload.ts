import { useState, useCallback } from 'react';
import type { FileCategory } from '../../domain/repositories/FileRepository';
import { DownloadFileUseCase } from '../../application/usecases/DownloadFileUseCase';
import { FileRepositoryImpl } from '../../infrastructure/repositories/FileRepositoryImpl';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

/**
 * Singleton use case: created once at module level.
 */
const downloadUseCase = new DownloadFileUseCase(new FileRepositoryImpl());

export interface UseFileDownloadResult {
  /**
   * Triggers a file download.
   * @param type          - File category ('incidents' | 'readings' | ...).
   * @param filename      - Filename with extension (e.g. 'photo.jpg').
   * @param downloadName  - Desired filename for the saved file (without extension — auto-derived from MIME).
   *                        Defaults to the original filename.
   */
  download: (
    type: FileCategory,
    filename: string,
    downloadName?: string
  ) => Promise<void>;
  /** True while the download is in progress. */
  isDownloading: boolean;
}

/**
 * useFileDownload
 *
 * Custom hook that encapsulates the full "download a server file to disk" flow:
 *   1. Fetch blob via GET /files/:type/:filename/download (authenticated)
 *   2. Create a temporary anchor element with the blob URL
 *   3. Trigger click → browser shows save dialog
 *   4. Revoke the blob URL and remove the anchor
 *
 * Maps to the backend endpoint:
 *   GET /files/:type/:filename/download  (JWT required)
 *
 * SRP: single responsibility — trigger browser file download.
 * DIP: depends on DownloadFileUseCase (application abstraction).
 *
 * @example
 * const { download, isDownloading } = useFileDownload();
 * <button disabled={isDownloading} onClick={() => download('incidents', 'photo.jpg', 'Evidencia')}>
 *   Descargar
 * </button>
 */
export function useFileDownload(): UseFileDownloadResult {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = useCallback(
    async (
      type: FileCategory,
      filename: string,
      downloadName?: string
    ): Promise<void> => {
      if (isDownloading) return;

      setIsDownloading(true);
      try {
        const blob = await downloadUseCase.execute(type, filename);
        const objectUrl = URL.createObjectURL(blob);

        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        // Use the provided downloadName, falling back to the original filename
        anchor.download = downloadName ?? filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        URL.revokeObjectURL(objectUrl);
      } catch (err) {
        console.error('[useFileDownload] Error downloading file:', err);
        MessageToastCustom('error', 'Error', 'No se pudo descargar el archivo.');
      } finally {
        setIsDownloading(false);
      }
    },
    [isDownloading]
  );

  return { download, isDownloading };
}
