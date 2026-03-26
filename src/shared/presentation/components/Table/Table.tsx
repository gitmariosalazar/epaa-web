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
import { Button } from '../Button/Button';
import { ColoredIcons } from '../../utils/icons/CustomIcons';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
  sortable?: boolean;
  sortKey?: keyof T;
  isNumeric?: boolean;
  id?: string;
}

export interface SummaryRow {
  label: string;
  value: string | number;
  highlight?: boolean;
  percentage?: string;
}

export type RowColor = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface TotalRow {
  label: string;
  value: string | number;
  highlight?: boolean;
  percentage?: string;
  columnId?: string;
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
  onExportPdf?: () => void;
  getRowColor?: (item: T) => RowColor | undefined;
  getRowClassName?: (item: T) => string | undefined;
  onEndReached?: () => void;
  hasMore?: boolean;
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
  fullHeight = false,
  onExportPdf,
  getRowColor,
  getRowClassName,
  onEndReached,
  hasMore
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

  const observerTarget = React.useRef(null);

  React.useEffect(() => {
    if (!onEndReached || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onEndReached();
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [onEndReached, hasMore]);

  if (isLoading && data.length === 0) {
    return (
      <div className="table-loader">
        <div className="spinner"></div>{' '}
        {/* You can replace this with a proper Spinner component if available */}
        {t('common.table.loading')}
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / currentLimit);
  const paginatedData = pagination
    ? data.slice((currentPage - 1) * currentLimit, currentPage * currentLimit)
    : data;

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
      // Opcional: si nos estamos acercando, pre-fetchear
      if (currentPage === totalPages - 1 && hasMore && onEndReached) {
        onEndReached();
      }
    } else if (hasMore && onEndReached) {
      onEndReached();
      setCurrentPage((p) => p + 1);
    }
  };

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
              paginatedData.map((item, rowIndex) => {
                const rowColor = getRowColor ? getRowColor(item) : undefined;
                const customClassName = getRowClassName
                  ? getRowClassName(item)
                  : '';
                const rowClassName = `table-row ${
                  rowColor ? `table-row--${rowColor}` : ''
                } ${customClassName}`.trim();

                return (
                  <tr key={rowIndex} className={rowClassName}>
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
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="empty-state-cell">
                  {isLoading ? (
                     <div className="table-loader" style={{ padding: '2rem' }}>{t('common.table.loading')}</div>
                  ) : emptyState || (
                    <div className="default-empty-state">
                      {t('common.table.noData')}
                    </div>
                  )}
                </td>
              </tr>
            )}
            {data && data.length > 0 && (
              <tr className="table-row--spacer" style={{ height: '100%', background: 'transparent' }}>
                <td colSpan={columns.length} style={{ padding: 0, border: 'none', background: 'transparent' }}></td>
              </tr>
            )}
            {onEndReached && hasMore && !pagination && (
              <tr ref={observerTarget} style={{ height: '20px' }}>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '10px', color: 'var(--text-muted)' }}>
                  {isLoading ? t('common.loading', 'Loading...') : ''}
                </td>
              </tr>
            )}
          </tbody>
          {totalRows.length > 0 && (
            <tfoot>
              <tr>
                {columns.map((col, colIndex) => {
                  // Find if there's a total row that somewhat matches the column or is exactly the very first column for "Total"
                  let totalContent: React.ReactNode = null;
                  let className = col.className || '';
                  let matchingTotal: TotalRow | undefined = undefined;

                  if (colIndex === 0) {
                    totalContent = 'Total';
                    className += ' total-label';
                  } else {
                    // Very simple matching heuristic: if the column isNumeric, find the corresponding total row
                    // In a perfect architecture, `totalRows` would map directly by accessor/key. This is a visual approximation.
                  const headerLower = typeof col.header === 'string' ? col.header.toLowerCase() : '';
                  const colId = col.id;
                  const colAccessor = typeof col.accessor === 'string' ? col.accessor : '';

                  matchingTotal =
                    totalRows.find((r) => r.columnId && colId && r.columnId === colId) ||
                    totalRows.find((r) => r.columnId && colAccessor && r.columnId === colAccessor) ||
                    totalRows.find((r) => r.label === col.header) ||
                    totalRows.find((r) => r.label.toLowerCase() === headerLower) ||
                    totalRows.find(
                      (r) =>
                        r.label.toLowerCase().includes(headerLower) ||
                        (col.accessor === 'transactionsCount' && r.label.includes('FACTURAS')) ||
                        (col.accessor === 'totalTransactions' && r.label.includes('FACTURAS')) ||
                        (headerLower && r.label.toLowerCase().includes(headerLower.replace('total', '').trim()))
                    );

                  if (matchingTotal) {
                      totalContent =
                        typeof matchingTotal.value === 'number'
                          ? new Intl.NumberFormat('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }).format(matchingTotal.value)
                          : matchingTotal.value;
                      if (matchingTotal.percentage) {
                        totalContent = (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span>{totalContent}</span>
                            <span style={{ fontSize: '0.7em', color: 'var(--text-muted)' }}>{matchingTotal.percentage}</span>
                          </div>
                        );
                      }
                    }
                  }

                  const isHighlighted = matchingTotal?.highlight;
                  const cellClassName = `${className} ${isHighlighted ? 'total-cell--highlight' : ''}`.trim();

                  return (
                    <td
                      key={colIndex}
                      className={cellClassName}
                      style={{
                        ...col.style,
                        textAlign: colIndex === 0 ? 'left' : 'right',
                        fontWeight: 'bold'
                      }}
                    >
                      {totalContent}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>




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
        <div className="table-pagination-container">
          <div className="table-pagination-left">
            <span className="table-pagination-records">
              {t('common.table.totalRecords', {
                count: data.length,
                defaultValue: `Total Registros: ${data.length}${hasMore ? '+' : ''}`
              })}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="table-pagination-records" style={{ color: 'var(--text-secondary)' }}>
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

          <div className="table-pagination-center">
            {totalPages > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="table-pagination-page-text">
                  {t('common.pagination.page', {
                    current: currentPage,
                    total: hasMore ? `${totalPages}+` : totalPages
                  }) || `Pág. ${currentPage} / ${hasMore ? totalPages + '+' : totalPages}`}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage >= totalPages && !hasMore}
                  className="pagination-btn"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          <div className="table-pagination-right">
            {onExportPdf && (
              <Button
                onClick={onExportPdf}
                variant="outline"
                color="slate"
                iconOnly
                circle
                size="sm"
                disabled={data.length === 0}
                title={t('common.exportPdf', 'Exportar PDF')}
                leftIcon={ColoredIcons.Pdf}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
