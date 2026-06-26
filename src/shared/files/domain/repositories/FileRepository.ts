/**
 * FileRepository
 *
 * Domain contract for serving files through the authenticated
 * /files/:type/:filename endpoint.
 *
 * Clean Architecture: Domain concern only — no HTTP, no infrastructure.
 * DIP: all consumers depend on this interface, never on the concrete impl.
 *
 * ─── Backend endpoints (require JWT) ────────────────────────────────────────
 *   GET /files/:type/:filename/preview   → inline blob (browser preview)
 *   GET /files/:type/:filename/download  → attachment blob (force download)
 *
 * ─── Valid :type values (from backend FILE_TYPE_DIR_MAP) ────────────────────
 *   incidents | readings | qrcodes | connections | work_orders
 */
export interface FileRepository {
  /**
   * Fetches a file as a Blob for inline previewing.
   * Calls: GET /files/:type/:filename/preview
   *
   * @param type     - File category (e.g. 'incidents', 'readings').
   * @param filename - Filename with extension (e.g. 'photo.jpg', 'report.pdf').
   */
  preview(type: FileCategory, filename: string): Promise<Blob>;

  /**
   * Fetches a file as a Blob for download (attachment disposition).
   * Calls: GET /files/:type/:filename/download
   *
   * @param type     - File category (e.g. 'incidents', 'readings').
   * @param filename - Filename with extension (e.g. 'photo.jpg', 'report.pdf').
   */
  download(type: FileCategory, filename: string): Promise<Blob>;
}

/**
 * FileCategory
 *
 * Union type of all valid :type values accepted by the backend controller.
 * Must stay in sync with FILE_TYPE_DIR_MAP in the backend.
 *
 * OCP: add a new category here when the backend adds one — no other changes needed.
 */
export type FileCategory =
  | 'incidents'
  | 'readings'
  | 'qrcodes'
  | 'connections'
  | 'work_orders';
