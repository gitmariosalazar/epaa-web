import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Download, ChevronLeft, ChevronRight,
  Loader2, ImageOff, ZoomIn
} from 'lucide-react';
import { useFilePreview } from '@/shared/files';
import { useFileDownload } from '@/shared/files';
import type { FileCategory } from '@/shared/files';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface LightboxPhoto {
  photoId: number;
  filePath: string;
  type: string;
}

interface PhotoLightboxProps {
  /** All photos of the gallery. */
  photos: LightboxPhoto[];
  /** Index of the initially visible photo. */
  activeIndex: number;
  /** File category used for the /files/:category/:filename endpoint. */
  category: FileCategory;
  /** Called when the lightbox is closed. */
  onClose: () => void;
  /** Called when the user navigates to a different photo. */
  onIndexChange: (index: number) => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function extractFilename(filePath: string): string {
  return filePath.split('/').pop() ?? filePath;
}

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * PhotoLightbox
 *
 * Full-screen photo viewer with prev/next navigation, keyboard support,
 * and download action. Rendered in a portal over the entire viewport.
 *
 * SRP: responsible only for displaying a single photo at a time
 *      and providing navigation/download controls.
 * DIP: depends on useFilePreview and useFileDownload (hook abstractions),
 *      not on any HTTP client or repository.
 *
 * Navigation:
 *   - Click backdrop or × button → close
 *   - ← / → arrow keys → previous / next
 *   - Escape key → close
 */
export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photos,
  activeIndex,
  category,
  onClose,
  onIndexChange
}) => {
  const photo = photos[activeIndex];
  const filename = photo ? extractFilename(photo.filePath) : '';

  // Authenticated fetch for the currently visible photo
  const { blobUrl, loading, error } = useFilePreview(
    photo ? category : undefined,
    filename || undefined
  );

  // Download hook
  const { download, isDownloading } = useFileDownload();

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < photos.length - 1;

  // ── Keyboard navigation ──────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowLeft' && hasPrev) { onIndexChange(activeIndex - 1); return; }
    if (e.key === 'ArrowRight' && hasNext) { onIndexChange(activeIndex + 1); return; }
  }, [onClose, onIndexChange, activeIndex, hasPrev, hasNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ── Lock body scroll while open ──────────────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (!photo) return null;

  const handleDownload = () => {
    download(category, filename, `Evidencia-${photo.photoId}`);
  };

  return createPortal(
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Vista de evidencia fotográfica"
    >
      {/* ── Panel (stops click propagation) ── */}
      <div className="lightbox-panel" onClick={(e) => e.stopPropagation()}>

        {/* ── Top bar ── */}
        <div className="lightbox-topbar">
          <div className="lightbox-meta">
            <ZoomIn size={15} style={{ opacity: 0.6 }} />
            <span className="lightbox-type">{photo.type}</span>
            <span className="lightbox-counter">
              {activeIndex + 1} / {photos.length}
            </span>
          </div>
          <div className="lightbox-actions">
            <Tooltip content='Descargar imagen' position='bottom' followCursor={false}>

              <Button
                className="lightbox-btn lightbox-btn--download"
                onClick={handleDownload}
                disabled={isDownloading || !blobUrl}
                aria-label="Descargar imagen"
                size='xs'
              >
                {isDownloading
                  ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  : <Download size={16} />}
                <span>Descargar</span>
              </Button>
            </Tooltip>
            <Tooltip content='Cerrar visor' position='bottom' followCursor={false}>
              <Button
                className="lightbox-btn lightbox-btn--close"
                onClick={onClose}
                aria-label="Cerrar visor"
                size='xs'
              >
                <X size={18} />
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* ── Main viewer ── */}
        <div className="lightbox-viewer">
          {/* Prev button */}
          <Tooltip content='Foto anterior' position='bottom'>
            <Button
              className={`lightbox-nav lightbox-nav--prev${!hasPrev ? ' lightbox-nav--disabled' : ''}`}
              onClick={() => hasPrev && onIndexChange(activeIndex - 1)}
              disabled={!hasPrev}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={28} />
            </Button>
          </Tooltip>

          {/* Image area */}
          <div className="lightbox-image-area">
            {loading && (
              <div className="lightbox-state">
                <Loader2
                  size={36}
                  style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite' }}
                />
                <span>Cargando imagen...</span>
              </div>
            )}
            {!loading && error && (
              <div className="lightbox-state lightbox-state--error">
                <ImageOff size={40} style={{ opacity: 0.4 }} />
                <span>No se pudo cargar la imagen</span>
              </div>
            )}
            {!loading && blobUrl && (
              <img
                key={blobUrl}
                src={blobUrl}
                alt={`Evidencia ${photo.type} #${photo.photoId}`}
                className="lightbox-image"
              />
            )}
          </div>

          {/* Next button */}
          <Tooltip content='Foto siguiente' position='bottom'>
            <Button
              className={`lightbox-nav lightbox-nav--next${!hasNext ? ' lightbox-nav--disabled' : ''}`}
              onClick={() => hasNext && onIndexChange(activeIndex + 1)}
              disabled={!hasNext}
              aria-label="Foto siguiente"
            >
              <ChevronRight size={28} />
            </Button>
          </Tooltip>
        </div>

        {/* ── Thumbnail strip (horizontal scroll) ── */}
        {photos.length > 1 && (
          <div className="lightbox-strip">
            {photos.map((p, idx) => (
              <ThumbItem
                key={p.photoId}
                photo={p}
                category={category}
                isActive={idx === activeIndex}
                onClick={() => onIndexChange(idx)}
              />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// ─── ThumbItem ──────────────────────────────────────────────────────────────────

interface ThumbItemProps {
  photo: LightboxPhoto;
  category: FileCategory;
  isActive: boolean;
  onClick: () => void;
}

/**
 * ThumbItem
 *
 * Renders a single thumbnail in the lightbox bottom strip.
 * Each owns its own useFilePreview instance for correct hook lifecycle.
 *
 * SRP: load and display one thumbnail.
 */
const ThumbItem: React.FC<ThumbItemProps> = ({ photo, category, isActive, onClick }) => {
  const filename = extractFilename(photo.filePath);
  const { blobUrl, loading } = useFilePreview(category, filename);

  return (
    <Tooltip content={photo.type} position='bottom' followCursor={false}>
      <button
        className={`lightbox-thumb${isActive ? ' lightbox-thumb--active' : ''}`}
        onClick={onClick}
        aria-label={`Ver ${photo.type}`}
      >
        {loading && (
          <div className="lightbox-thumb-loading">
            <Loader2 size={12} style={{ animation: 'spin 1s linear infinite', opacity: 0.5 }} />
          </div>
        )}
        {!loading && blobUrl && (
          <img src={blobUrl} alt={photo.type} className="lightbox-thumb-img" />
        )}
        {!loading && !blobUrl && (
          <div className="lightbox-thumb-loading">
            <ImageOff size={12} style={{ opacity: 0.4 }} />
          </div>
        )}
      </button>
    </Tooltip>
  );
};
