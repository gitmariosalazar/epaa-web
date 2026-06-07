import type { DocumentRepository } from '../../domain/repositories/DocumentRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';
import { environments } from '@/settings/environments/environments';
import { localStorageService } from '@/shared/infrastructure/storage/LocalStorageService';

/**
 * DocumentRepositoryImpl
 *
 * Implements the endpoint to download/preview a document from the gateway.
 *
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
   */
  async preview(documentId?: string, documentUrl?: string): Promise<Blob> {
    if (documentId?.trim()) {
      const response = await this.client.get<Blob>(
        `/connection-documents/${documentId}/preview`,
        { responseType: 'blob' }
      );
      return response.data;
    }

    if (documentUrl?.trim()) {
      return this.fetchBlobFromUrl(documentUrl);
    }

    throw new Error('Document ID or document URL is required');
  }

  /**
   * Downloads the document as a Blob (attachment).
   * GET /connection-documents/:documentId/download-file
   */
  async download(documentId?: string, documentUrl?: string): Promise<Blob> {
    if (documentId?.trim()) {
      const response = await this.client.get<Blob>(
        `/connection-documents/${documentId}/download-file`,
        { responseType: 'blob' }
      );
      return response.data;
    }

    if (documentUrl?.trim()) {
      return this.fetchBlobFromUrl(documentUrl);
    }

    throw new Error('Document ID or document URL is required');
  }

  private resolveDocumentUrl(documentUrl: string): string {
    if (/^https?:\/\//i.test(documentUrl)) {
      return documentUrl;
    }

    if (documentUrl.startsWith('/')) {
      return `${this.apiBase}${documentUrl}`;
    }

    return `${this.apiBase}/${documentUrl}`;
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
