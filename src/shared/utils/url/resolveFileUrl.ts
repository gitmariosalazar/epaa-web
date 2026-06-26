import { environments } from '@/settings/environments/environments';

/**
 * resolveFileUrl
 *
 * Converts a relative server path into a fully-qualified URL.
 *
 * ⚠️ USE ONLY FOR PUBLICLY ACCESSIBLE RESOURCES (no auth required).
 * Examples: logos, public avatars, public CDN assets.
 *
 * For protected/private server files (documents, evidence photos, etc.)
 * use <ProtectedImage> or useDocumentPreview instead — they fetch the
 * resource with the Authorization header and return a safe blob URL.
 *
 * @param filePath - Relative or absolute file path.
 * @returns Fully-qualified URL string, or empty string if filePath is falsy.
 */
export function resolveFileUrl(filePath?: string | null): string {
  if (!filePath) return '';
  if (/^https?:\/\//i.test(filePath)) return filePath;

  const apiBase = (environments.API_URL || '')
    .replace(/\/api$/, '')
    .replace(/\/$/, '');

  return filePath.startsWith('/')
    ? `${apiBase}${filePath}`
    : `${apiBase}/${filePath}`;
}
