import React from 'react';
import '@/shared/presentation/styles/Table.css';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
  sortable?: boolean;
  sortKey?: keyof T;
  isNumeric?: boolean;
}

export interface SummaryRow {
  label: string;
  value: string | number;
  highlight?: boolean;
  percentage?: string;
}

interface TotalRow {
  label: string;
  value: string | number;
  highlight?: boolean;
  percentage?: string;
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
  sortConfig?: { key: keyof T | string; direction: 'asc' | 'desc' } | null;
  onSort?: (key: keyof T | string, direction: 'asc' | 'desc') => void;
  summaryRows?: SummaryRow[];
  totalRows?: TotalRow[];
  width?: '100' | '70' | '50' | 'auto';
  fullHeight?: boolean;
}

export const Table = <T extends { [key: string]: any }>({
  data,
  columns,
  isLoading,
  containerClassName = '',
  containerStyle = {},
  pagination = false,
  pageSize = 15,
  emptyState,
  sortConfig,
  onSort,
  summaryRows = [],
  totalRows = [],
  width = '100',
  fullHeight = false
}: TableProps<T>) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentLimit, setCurrentLimit] = React.useState(pageSize);

  React.useEffect(() => {
    setCurrentLimit(pageSize);
  }, [pageSize]);

  // Adjust page when data changes (e.g. new search or data refresh)
  React.useEffect(() => {
    const totalPages = Math.ceil(data.length / currentLimit);
    // Only reset if current page is out of bounds
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [data, currentLimit, currentPage]);

  const handleSort = (key: keyof T | string) => {
    if (!onSort) return;

    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    onSort(key, direction);
  };

  if (isLoading) {
    return (
      <div className="table-loader">
        <div className="spinner"></div>{' '}
        {/* You can replace this with a proper Spinner component if available */}
        Loading...
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / currentLimit);
  const paginatedData = pagination
    ? data.slice((currentPage - 1) * currentLimit, currentPage * currentLimit)
    : data;

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div
      className={`table-container table--w-${width} ${
        fullHeight ? 'table--full-height' : ''
      } ${containerClassName}`}
      style={containerStyle}
    >
      <div className="table-body-wrapper">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col, index) => {
                const isSortable = col.sortable;
                const sortKey =
                  col.sortKey ||
                  (typeof col.accessor === 'string' ? col.accessor : undefined);
                const isSorted = sortConfig?.key === sortKey;

                return (
                  <th
                    key={index}
                    className={col.className}
                    style={{
                      ...col.style,
                      cursor: isSortable ? 'pointer' : 'default',
                      userSelect: 'none'
                    }}
                    onClick={() => isSortable && sortKey && handleSort(sortKey)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {col.header}
                      {isSortable && (
                        <span style={{ display: 'inline-flex' }}>
                          {isSorted ? (
                            sortConfig?.direction === 'asc' ? (
                              <ArrowUp size={14} />
                            ) : (
                              <ArrowDown size={14} />
                            )
                          ) : (
                            <ArrowUpDown
                              size={14}
                              className="text-gray-400 opacity-50"
                            />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
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
                      style={{
                        ...col.style,
                        textAlign: col.isNumeric ? 'right' : 'inherit'
                      }}
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

      {totalRows.length > 0 && (
        <div className="table-totals-horizontal">
          {totalRows.map((row, idx) => (
            <div
              key={idx}
              className={`table-total-item ${
                row.highlight ? 'table-total-item--highlight' : ''
              }`}
            >
              <div className="table-total-label">
                {row.label}
                {row.percentage && (
                  <span className="table-total-percentage">
                    ({row.percentage})
                  </span>
                )}
              </div>
              <div className="table-total-value">
                {typeof row.value === 'number'
                  ? new Intl.NumberFormat('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(row.value)
                  : row.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {summaryRows.length > 0 && (
        <div className="table-summary-block">
          <div className="table-summary-content">
            {summaryRows.map((row, idx) => (
              <div
                key={idx}
                className={`table-summary-row ${
                  row.highlight ? 'table-summary-row--highlight' : ''
                }`}
              >
                <div className="table-summary-label">
                  <span>{row.label}</span>
                  {row.percentage && (
                    <span className="table-summary-percentage">
                      {row.percentage}
                    </span>
                  )}
                </div>
                <div className="table-summary-value">
                  {typeof row.value === 'number'
                    ? new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }).format(row.value)
                    : row.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pagination && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            borderTop: '1px solid var(--border-color)',
            background: 'var(--surface)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap'
            }}
          >
            <span
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}
            >
              {t('common.table.totalRecords', {
                count: data.length,
                defaultValue: `Total Registros: ${data.length}`
              })}
            </span>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span
                style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}
              >
                {t('common.table.rowsPerPage', {
                  defaultValue: 'Rows per page:'
                })}
              </span>
              <select
                value={currentLimit}
                onChange={(e) => {
                  setCurrentLimit(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="table-rows-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                justifyContent: 'center'
              }}
            >
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="pagination-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.35rem'
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  minWidth: '90px',
                  textAlign: 'center'
                }}
              >
                {t('common.pagination.page', {
                  current: currentPage,
                  total: totalPages
                }) || `Pág. ${currentPage} / ${totalPages}`}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="pagination-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.35rem'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
