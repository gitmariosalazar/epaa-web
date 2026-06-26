import type { DocumentRepository } from '../../domain/repositories/DocumentRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import { environments } from '@/settings/environments/environments';
import { localStorageService } from '@/shared/infrastructure/storage/LocalStorageService';

/**
 * MIME types considered "generic" — when the server returns these,
 * we try to infer the real type from the URL extension.
 * Infrastructure concern: compensates for misconfigured servers.
 */
const GENERIC_MIME_TYPES = new Set([
  '',
  'application/octet-stream',
  'binary/octet-stream'
]);

/**
 * Infers a MIME type from a file URL's extension.
 * Returns null if the extension is unknown.
 *
 * Infrastructure concern: the server may not always send the correct
 * Content-Type header (e.g. S3, MinIO, generic proxies).
 */
function inferMimeTypeFromUrl(url?: string | null): string | null {
  if (!url) return null;
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':  return 'application/pdf';
    case 'png':  return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'webp': return 'image/webp';
    case 'gif':  return 'image/gif';
    case 'svg':  return 'image/svg+xml';
    case 'txt':  return 'text/plain';
    default:     return null;
  }
}

/**
 * DocumentRepositoryImpl
 *
 * Implements the endpoint to download/preview a document from the gateway.
 * SRP: single responsibility — HTTP transport and blob delivery.
 * DIP: implements the DocumentRepository interface (domain contract).
 * Clean Architecture: Infrastructure concern only.
 */
export class DocumentRepositoryImpl implements DocumentRepository {
  private readonly client: HttpClientInterface;
  private readonly apiBase = (environments.API_URL || '')
    .replace(/\/api$/, '')
    .replace(/\/$/, '');

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  /**
   * Fetches the document as a Blob for inline previewing.
   * GET /connection-documents/:documentId/preview
   *
   * Always returns a Blob with a resolved MIME type.
   * If the server omits Content-Type, it is inferred from the URL extension.
   */
  async preview(documentId?: string, documentUrl?: string): Promise<Blob> {
    if (documentId?.trim()) {
      const response = await this.client.get<Blob>(
        `/connection-documents/${documentId}/preview`,
        { responseType: 'blob' }
      );
      return this.resolveBlobMimeType(response.data, documentUrl);
    }

    if (documentUrl?.trim()) {
      const blob = await this.fetchBlobFromUrl(documentUrl);
      return this.resolveBlobMimeType(blob, documentUrl);
    }

    throw new Error('Document ID or document URL is required');
  }

  /**
   * Downloads the document as a Blob (attachment).
   * GET /connection-documents/:documentId/download-file
   *
   * Always returns a Blob with a resolved MIME type.
   */
  async download(documentId?: string, documentUrl?: string): Promise<Blob> {
    if (documentId?.trim()) {
      const response = await this.client.get<Blob>(
        `/connection-documents/${documentId}/download-file`,
        { responseType: 'blob' }
      );
      return this.resolveBlobMimeType(response.data, documentUrl);
    }

    if (documentUrl?.trim()) {
      const blob = await this.fetchBlobFromUrl(documentUrl);
      return this.resolveBlobMimeType(blob, documentUrl);
    }

    throw new Error('Document ID or document URL is required');
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  /**
   * Ensures the blob carries a meaningful MIME type.
   * If the server returned a generic type (or none), we infer from the URL.
   * Returns a new Blob with the corrected type; original data is untouched.
   */
  private resolveBlobMimeType(blob: Blob, url?: string | null): Blob {
    const hasUsableMime = blob.type && !GENERIC_MIME_TYPES.has(blob.type);
    if (hasUsableMime) return blob;

    const inferred = inferMimeTypeFromUrl(url);
    if (!inferred) return blob;

    return blob.slice(0, blob.size, inferred);
  }

  private resolveDocumentUrl(documentUrl: string): string {
    if (/^https?:\/\//i.test(documentUrl)) {
      return documentUrl;
    }
    return documentUrl.startsWith('/')
      ? `${this.apiBase}${documentUrl}`
      : `${this.apiBase}/${documentUrl}`;
  }

  private async fetchBlobFromUrl(documentUrl: string): Promise<Blob> {
    const resolvedUrl = this.resolveDocumentUrl(documentUrl);
    const token = localStorageService.getItem('token');
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const response = await fetch(resolvedUrl, {
      method: 'GET',
      credentials: 'include',
      headers
    });

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    return response.blob();
  }
}
