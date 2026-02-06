import React from 'react';
import '@/shared/presentation/styles/Table.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  pagination?: boolean;
  pageSize?: number;
  emptyState?: React.ReactNode;
}

export const Table = <T extends { [key: string]: any }>({
  data,
  columns,
  isLoading,
  containerClassName = '',
  containerStyle = {},
  pagination = false,
  pageSize = 15,
  emptyState
}: TableProps<T>) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = React.useState(1);

  // Adjust page when data changes (e.g. new search or data refresh)
  React.useEffect(() => {
    const totalPages = Math.ceil(data.length / pageSize);
    // Only reset if current page is out of bounds
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
    // If we wanted strict "search resets to 1", we'd need a separate prop or callback.
    // For now, "persistence unless undefined" is the requested behavior.
  }, [data, pageSize]);

  if (isLoading) {
    return (
      <div className="table-loader">
        <div className="spinner"></div>{' '}
        {/* You can replace this with a proper Spinner component if available */}
        Loading...
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = pagination
    ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : data;

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div
      className={`table-container ${containerClassName}`}
      style={{ ...containerStyle, display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={col.className} style={col.style}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={col.className}
                      style={col.style}
                    >
                      {typeof col.accessor === 'function'
                        ? col.accessor(item)
                        : item[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="empty-state-cell">
                  {emptyState || (
                    <div className="default-empty-state">No data found</div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--surface)'
          }}
        >
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="btn-icon"
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--surface)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--text-secondary)'
            }}
          >
            {t('common.pagination.page', {
              current: currentPage,
              total: totalPages
            }) || `Page ${currentPage} of ${totalPages}`}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="btn-icon"
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--surface)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
