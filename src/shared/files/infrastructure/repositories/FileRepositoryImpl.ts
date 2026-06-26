import type { FileRepository, FileCategory } from '../../domain/repositories/FileRepository';
import { apiClient } from '@/shared/infrastructure/api/client/ApiClient';
import type { HttpClientInterface } from '@/shared/infrastructure/api/interfaces/HttpClientInterface';

/**
 * MIME types the server may return when it cannot determine the content type.
 * When these are returned we infer the real type from the filename extension.
 * Infrastructure concern: compensates for misconfigured servers / proxies.
 */
const GENERIC_MIME_TYPES = new Set([
  '',
  'application/octet-stream',
  'binary/octet-stream'
]);

/**
 * Infers a MIME type from a filename's extension.
 * Covers the full set supported by the backend MIME_TYPE_MAP.
 * Returns null if the extension is unknown or absent.
 */
function inferMimeTypeFromFilename(filename: string): string | null {
  const ext = filename.split('?')[0].split('.').pop()?.toLowerCase();
  switch (ext) {
    // Images
    case 'jpg':
    case 'jpeg':  return 'image/jpeg';
    case 'png':   return 'image/png';
    case 'gif':   return 'image/gif';
    case 'webp':  return 'image/webp';
    case 'bmp':   return 'image/bmp';
    case 'svg':   return 'image/svg+xml';
    case 'ico':   return 'image/x-icon';
    case 'tiff':
    case 'tif':   return 'image/tiff';
    // Documents
    case 'pdf':   return 'application/pdf';
    case 'doc':   return 'application/msword';
    case 'docx':  return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'odt':   return 'application/vnd.oasis.opendocument.text';
    case 'txt':   return 'text/plain';
    case 'rtf':   return 'application/rtf';
    // Spreadsheets
    case 'xls':   return 'application/vnd.ms-excel';
    case 'xlsx':  return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'csv':   return 'text/csv';
    case 'ods':   return 'application/vnd.oasis.opendocument.spreadsheet';
    // Presentations
    case 'ppt':   return 'application/vnd.ms-powerpoint';
    case 'pptx':  return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    // Archives
    case 'zip':   return 'application/zip';
    case 'rar':   return 'application/vnd.rar';
    case '7z':    return 'application/x-7z-compressed';
    case 'tar':   return 'application/x-tar';
    case 'gz':    return 'application/gzip';
    // Data
    case 'json':  return 'application/json';
    case 'xml':   return 'application/xml';
    default:      return null;
  }
}

/**
 * FileRepositoryImpl
 *
 * Implements authenticated access to the backend /files/:type/:filename endpoint.
 *
 * SRP: single responsibility — HTTP transport and blob delivery for generic files.
 * DIP: implements the FileRepository interface (domain contract).
 * Clean Architecture: Infrastructure concern only.
 *
 * The apiClient (AxiosHttpClient) automatically attaches the Authorization header
 * and handles 401 → token refresh flow.
 *
 * The repository always returns a Blob with a resolved MIME type:
 * if the server sends a generic Content-Type, the type is inferred from
 * the filename extension (mirrors the backend MIME_TYPE_MAP exactly).
 */
export class FileRepositoryImpl implements FileRepository {
  private readonly client: HttpClientInterface;

  constructor(client: HttpClientInterface = apiClient) {
    this.client = client;
  }

  /**
   * Fetches the file as a Blob for inline previewing.
   * GET /files/:type/:filename/preview
   */
  async preview(type: FileCategory, filename: string): Promise<Blob> {
    const response = await this.client.get<Blob>(
      `/files/${type}/${encodeURIComponent(filename)}/preview`,
      { responseType: 'blob' }
    );
    return this.resolveBlobMimeType(response.data, filename);
  }

  /**
   * Fetches the file as a Blob for download (attachment disposition).
   * GET /files/:type/:filename/download
   */
  async download(type: FileCategory, filename: string): Promise<Blob> {
    const response = await this.client.get<Blob>(
      `/files/${type}/${encodeURIComponent(filename)}/download`,
      { responseType: 'blob' }
    );
    return this.resolveBlobMimeType(response.data, filename);
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  /**
   * Ensures the blob carries a meaningful MIME type.
   * If the server returned a generic type (or none), we infer from the filename.
   * Returns a new Blob with the corrected type; original data is untouched.
   */
  private resolveBlobMimeType(blob: Blob, filename: string): Blob {
    const hasUsableMime = blob.type && !GENERIC_MIME_TYPES.has(blob.type);
    if (hasUsableMime) return blob;

    const inferred = inferMimeTypeFromFilename(filename);
    if (!inferred) return blob;

    return blob.slice(0, blob.size, inferred);
  }
}
