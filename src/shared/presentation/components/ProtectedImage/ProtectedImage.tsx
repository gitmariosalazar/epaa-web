import React from 'react';
import { useDocumentPreview } from '@/modules/documents/presentation/hooks/useDocumentPreview';

interface ProtectedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /**
   * Relative or absolute server path to the protected image.
   * The fetch will be made with the Authorization header — the browser
   * never accesses the URL directly.
   */
  src: string;
  /**
   * Optional content to render while loading or on error.
   * Defaults to null (renders nothing).
   */
  fallback?: React.ReactNode;
  /** Alt text for the image (required for accessibility). */
  alt: string;
}

/**
 * ProtectedImage
 *
 * Renders a server-hosted image that requires authentication.
 *
 * Problem: `<img src="...">` sends no Authorization header, so protected
 * endpoints return 401 and the image never loads.
 *
 * Solution: internally fetches the image as an authenticated blob
 * (via useDocumentPreview → DocumentRepositoryImpl.fetchBlobFromUrl),
 * then renders the resulting object URL in a standard <img> element.
 * The blob URL is revoked automatically on unmount.
 *
 * SRP: single responsibility — render a protected image safely.
 * DIP: depends on useDocumentPreview (hook abstraction), not on any
 *      concrete HTTP client or repository.
 *
 * @example
 * // Instead of: <img src={resolveFileUrl(photo.filePath)} />  ← 401 for protected files
 * // Use:        <ProtectedImage src={photo.filePath} alt="Evidencia" />
 */
export const ProtectedImage: React.FC<ProtectedImageProps> = ({
  src,
  alt,
  fallback = null,
  ...imgProps
}) => {
  // documentId is undefined — we use the URL fallback path in the repository,
  // which performs an authenticated fetch and returns the blob.
  const { blobUrl, loading, error } = useDocumentPreview(undefined, src);

  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--surface-2, rgba(0,0,0,0.05))',
          borderRadius: 4
        }}
        aria-label={`Cargando imagen: ${alt}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.4, animation: 'spin 1s linear infinite' }}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    );
  }

  if (error || !blobUrl) {
    return <>{fallback}</>;
  }

  return <img src={blobUrl} alt={alt} {...imgProps} />;
};
