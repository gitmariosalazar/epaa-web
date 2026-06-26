import { useState, useEffect } from 'react';
import { PreviewDocumentUseCase } from '../../application/usecases/PreviewDocumentUseCase';
import { DocumentRepositoryImpl } from '../../infrastructure/repositories/DocumentRepositoryImpl';

/**
 * Singleton use case instance: created once at module level to avoid
 * re-instantiating on every render (OCP — open for extension via DI if needed).
 */
const previewUseCase = new PreviewDocumentUseCase(new DocumentRepositoryImpl());

export interface UseDocumentPreviewResult {
  /** Object URL of the previewed blob, or null while loading / on error. */
  blobUrl: string | null;
  /** MIME type returned (and resolved) by the repository, or null. */
  mimeType: string | null;
  /** True while the blob is being fetched. */
  loading: boolean;
  /** Error message if the fetch failed, or null. */
  error: string | null;
}

/**
 * useDocumentPreview
 *
 * Custom hook that fetches a document blob and exposes an object URL
 * suitable for use in `<iframe>` or `<img>` elements.
 *
 * SRP: single responsibility — manage blob lifecycle for inline preview.
 * DIP: depends on PreviewDocumentUseCase (application abstraction),
 *      not on the concrete repository.
 *
 * The blob URL is automatically revoked when:
 * - The document changes (documentId or documentUrl)
 * - The consumer component unmounts
 *
 * @param documentId - Preferred: unique document ID (calls the secure endpoint).
 * @param documentUrl - Fallback: direct document URL (legacy).
 */
export function useDocumentPreview(
  documentId?: string,
  documentUrl?: string
): UseDocumentPreviewResult {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Nothing to fetch if both identifiers are absent
    if (!documentId && !documentUrl) return;

    let cancelled = false;

    // Reset state synchronously before async fetch
    setLoading(true);
    setError(null);
    setBlobUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setMimeType(null);

    previewUseCase
      .execute(documentId, documentUrl)
      .then((blob) => {
        if (cancelled) return;
        setBlobUrl(URL.createObjectURL(blob));
        setMimeType(blob.type || null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudo cargar la vista previa del documento.';
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [documentId, documentUrl]);

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
