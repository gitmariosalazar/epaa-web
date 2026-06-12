/**
 * WorkOrderPagination
 *
 * SRP: paginación de la lista de órdenes de trabajo.
 * Espejo de SolicitudesPagination.
 */
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WorkOrderPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const WorkOrderPagination: React.FC<WorkOrderPaginationProps> = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = Math.min((page - 1) * pageSize + 1, total);
  const to   = Math.min(page * pageSize, total);

  return (
    <div className="wo-pagination">
      <span className="wo-pagination__info">
        {total > 0 ? `${from}–${to} de ${total} órdenes` : 'Sin órdenes'}
      </span>

      <div className="wo-pagination__controls">
        <button
          className="wo-pagination__btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
          id="wo-pagination-prev"
        >
          <ChevronLeft size={14} />
        </button>

        <span className="wo-pagination__current">
          {page} / {totalPages}
        </span>

        <button
          className="wo-pagination__btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Página siguiente"
          id="wo-pagination-next"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <select
        className="wo-pagination__size"
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        id="wo-pagination-size"
        aria-label="Órdenes por página"
      >
        {[5, 10, 20, 50].map((s) => (
          <option key={s} value={s}>{s} por página</option>
        ))}
      </select>
    </div>
  );
};
