import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WorkOrdersRelatedPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const WorkOrdersRelatedPagination = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange
}: WorkOrdersRelatedPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="wo-pagination">
      <div className="wo-pagination__perpage">
        <span>Filas por pagina</span>
        <select
          value={pageSize}
          onChange={(event) => {
            onPageSizeChange(Number(event.target.value));
            onPageChange(1);
          }}
        >
          {[5, 10, 15, 25].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <span className="wo-pagination__info">
        {total === 0 ? '0 resultados' : `${start}-${end} de ${total}`}
      </span>

      <div className="wo-pagination__controls">
        <button
          className="wo-pagination__btn"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={14} />
        </button>
        <button className="wo-pagination__btn wo-pagination__btn--active">
          {page}
        </button>
        <button
          className="wo-pagination__btn"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
