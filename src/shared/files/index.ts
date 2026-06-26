/**
 * @module shared/files
 *
 * Public API for the shared files module.
 *
 * This module provides authenticated access to the backend endpoint:
 *   GET /files/:type/:filename/preview   → inline preview
 *   GET /files/:type/:filename/download  → force download
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *
 * // In a React component — preview a file:
 * import { useFilePreview } from '@/shared/files';
 * const { blobUrl, loading, error } = useFilePreview('incidents', 'photo.jpg');
 *
 * // In a React component — download a file:
 * import { useFileDownload } from '@/shared/files';
 * const { download, isDownloading } = useFileDownload();
 * await download('connections', 'contrato.pdf', 'Contrato de Conexión');
 *
 * // For custom use cases (DI / testing):
 * import { FileRepositoryImpl, PreviewFileUseCase } from '@/shared/files';
 * const useCase = new PreviewFileUseCase(new FileRepositoryImpl());
 *
 * ─── Architecture ─────────────────────────────────────────────────────────────
 *   Domain       : FileRepository, FileCategory
 *   Application  : PreviewFileUseCase, DownloadFileUseCase
 *   Infrastructure: FileRepositoryImpl
 *   Presentation : useFilePreview, useFileDownload
 */

// ── Domain ─────────────────────────────────────────────────────────────────────
export type { FileRepository, FileCategory } from './domain/repositories/FileRepository';

// ── Application ────────────────────────────────────────────────────────────────
export { PreviewFileUseCase }  from './application/usecases/PreviewFileUseCase';
export { DownloadFileUseCase } from './application/usecases/DownloadFileUseCase';

// ── Infrastructure ─────────────────────────────────────────────────────────────
export { FileRepositoryImpl } from './infrastructure/repositories/FileRepositoryImpl';

// ── Presentation ───────────────────────────────────────────────────────────────
export { useFilePreview }  from './presentation/hooks/useFilePreview';
export type { UseFilePreviewResult }  from './presentation/hooks/useFilePreview';
export { useFileDownload } from './presentation/hooks/useFileDownload';
export type { UseFileDownloadResult } from './presentation/hooks/useFileDownload';
