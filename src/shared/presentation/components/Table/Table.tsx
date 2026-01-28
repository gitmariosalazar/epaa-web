import React from 'react';
import '@/shared/presentation/styles/Table.css';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  pagination?: boolean;
  pageSize?: number;
}

export const Table = <T extends { [key: string]: any }>({
  data,
  columns,
  isLoading,
  containerClassName = '',
  containerStyle = {},
  pagination = false,
  pageSize = 15
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  // Reset page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  if (isLoading) {
    return <div className="table-loader">Loading...</div>; // TODO: Better loader
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
                <th key={index} className={col.className}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={col.className}>
                    {typeof col.accessor === 'function'
                      ? col.accessor(item)
                      : item[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="table-pagination">
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <div className="pagination-controls">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
