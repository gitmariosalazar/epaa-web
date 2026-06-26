import { useState, useEffect } from 'react';
import type { FileCategory } from '../../domain/repositories/FileRepository';
import { PreviewFileUseCase } from '../../application/usecases/PreviewFileUseCase';
import { FileRepositoryImpl } from '../../infrastructure/repositories/FileRepositoryImpl';

/**
 * Singleton use case: created once at module level to avoid re-instantiating
 * on every render (OCP — swap the implementation via DI if needed later).
 */
const previewUseCase = new PreviewFileUseCase(new FileRepositoryImpl());

export interface UseFilePreviewResult {
  /** Object URL of the previewed blob, or null while loading / on error. */
  blobUrl: string | null;
  /** Resolved MIME type of the file, or null. */
  mimeType: string | null;
  /** True while the blob is being fetched. */
  loading: boolean;
  /** Error message if the fetch failed, or null. */
  error: string | null;
}

/**
 * useFilePreview
 *
 * Custom hook that fetches a server-hosted file as an authenticated blob
 * and exposes an object URL suitable for `<iframe>`, `<img>`, or `<video>`.
 *
 * Maps to the backend endpoint:
 *   GET /files/:type/:filename/preview  (JWT required)
 *
 * SRP: single responsibility — manage the blob lifecycle for inline preview.
 * DIP: depends on PreviewFileUseCase (application abstraction), not the repo.
 *
 * The blob URL is revoked automatically when:
 * - type or filename changes
 * - the consumer component unmounts
 *
 * @param type     - File category ('incidents' | 'readings' | 'qrcodes' | 'connections' | 'work_orders').
 * @param filename - Filename with extension (e.g. 'photo.jpg', 'report.pdf').
 *
 * @example
 * const { blobUrl, loading, error } = useFilePreview('incidents', photo.filename);
 * return loading ? <Spinner /> : <img src={blobUrl ?? ''} alt="Evidencia" />;
 */
export function useFilePreview(
  type?: FileCategory,
  filename?: string
): UseFilePreviewResult {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !filename?.trim()) return;

    let cancelled = false;

    setLoading(true);
    setError(null);
    setBlobUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setMimeType(null);

    previewUseCase
      .execute(type, filename)
      .then((blob) => {
        if (cancelled) return;
        setBlobUrl(URL.createObjectURL(blob));
        setMimeType(blob.type || null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar la vista previa del archivo.'
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [type, filename]);

  // Revoke blob URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      setBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, []);

  return { blobUrl, mimeType, loading, error };
}
