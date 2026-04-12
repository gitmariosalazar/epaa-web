import React from 'react';
import '@/shared/presentation/styles/Table.css';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  SearchX,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button/Button';
import { ColoredIcons } from '../../utils/icons/CustomIcons';
import { EmptyState } from '../common/EmptyState';
import { Tooltip } from '../common/Tooltip/Tooltip';
import { Modal } from '../Modal/Modal';
import { HiViewGridAdd } from 'react-icons/hi';

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
  loadingState?: React.ReactNode;
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
  onExportExcel?: () => void;
  getRowColor?: (item: T) => RowColor | undefined;
  getRowClassName?: (item: T) => string | undefined;
  onEndReached?: () => void;
  hasMore?: boolean;
}

export const Table = <T extends { [key: string]: any }>({
  data,
  columns,
  isLoading,
  loadingState,
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
  fullHeight = true,
  onExportPdf,
  onExportExcel,
  getRowColor,
  getRowClassName,
  onEndReached,
  hasMore
}: TableProps<T>) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentLimit, setCurrentLimit] = React.useState(pageSize);
  const [hiddenColumnKeys, setHiddenColumnKeys] = React.useState<Set<string>>(
    new Set()
  );
  const [isColumnModalOpen, setIsColumnModalOpen] = React.useState(false);

  const [draftHiddenColumns, setDraftHiddenColumns] = React.useState<
    Set<string>
  >(new Set());

  React.useEffect(() => {
    if (isColumnModalOpen) {
      setDraftHiddenColumns(new Set(hiddenColumnKeys));
    }
  }, [isColumnModalOpen, hiddenColumnKeys]);

  const getColumnKey = React.useCallback((col: Column<T>, index: number) => {
    if (col.id) return col.id;
    if (typeof col.accessor === 'string') return col.accessor;
    return `col-${index}`;
  }, []);

  const visibleColumns = React.useMemo(() => {
    return columns.filter(
      (col, index) => !hiddenColumnKeys.has(getColumnKey(col, index))
    );
  }, [columns, hiddenColumnKeys, getColumnKey]);

  const draftVisibleColumns = React.useMemo(() => {
    return columns.filter(
      (col, index) => !draftHiddenColumns.has(getColumnKey(col, index))
    );
  }, [columns, draftHiddenColumns, getColumnKey]);

  const handleSelectAllColumns = React.useCallback(() => {
    setDraftHiddenColumns(new Set());
  }, []);

  const handleClearAllColumns = React.useCallback(() => {
    const allKeys = columns.map((col, idx) => getColumnKey(col, idx));
    const newSet = new Set(allKeys);
    if (allKeys.length > 0) newSet.delete(allKeys[0]); // Keep at least one column
    setDraftHiddenColumns(newSet);
  }, [columns, getColumnKey]);

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

  const hasExports = !!(onExportExcel || onExportPdf);
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
        <table className="table custom-table">
          <thead>
            <tr>
              {visibleColumns.map((col, index) => {
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
                        <span
                          style={{
                            display: 'inline-flex',
                            opacity: isSorted ? 1 : 0.3
                          }}
                        >
                          {isSorted ? (
                            sortConfig?.direction === 'asc' ? (
                              <ArrowUp size={14} strokeWidth={2.5} />
                            ) : (
                              <ArrowDown size={14} strokeWidth={2.5} />
                            )
                          ) : (
                            <ArrowUpDown size={14} strokeWidth={2} />
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
                    {visibleColumns.map((col, colIndex) => (
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
                <td
                  colSpan={visibleColumns.length}
                  className="empty-state-cell"
                >
                  {isLoading
                    ? loadingState || (
                        <div
                          className="table-loader"
                          style={{ padding: '2rem' }}
                        >
                          <div className="spinner"></div>
                          {t('common.table.loading')}
                        </div>
                      )
                    : emptyState || (
                        <div className="default-empty-state">
                          <EmptyState
                            message={t('common.table.noData')}
                            icon={SearchX}
                            minHeight="300px"
                          />
                        </div>
                      )}
                </td>
              </tr>
            )}
            {data && data.length > 0 && (
              <tr
                className="table-row--spacer"
                style={{ height: '100%', background: 'transparent' }}
              >
                <td
                  colSpan={visibleColumns.length}
                  style={{
                    padding: 0,
                    border: 'none',
                    background: 'transparent'
                  }}
                ></td>
              </tr>
            )}
            {onEndReached && hasMore && !pagination && (
              <tr ref={observerTarget} style={{ height: '20px' }}>
                <td
                  colSpan={visibleColumns.length}
                  style={{
                    textAlign: 'center',
                    padding: '10px',
                    color: 'var(--text-muted)'
                  }}
                >
                  {isLoading ? t('common.loading', 'Loading...') : ''}
                </td>
              </tr>
            )}
          </tbody>
          {totalRows.length > 0 && (
            <tfoot>
              <tr>
                {visibleColumns.map((col, colIndex) => {
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
                    const headerLower =
                      typeof col.header === 'string'
                        ? col.header.toLowerCase()
                        : '';
                    const colId = col.id;
                    const colAccessor =
                      typeof col.accessor === 'string' ? col.accessor : '';

                    matchingTotal =
                      totalRows.find(
                        (r) => r.columnId && colId && r.columnId === colId
                      ) ||
                      totalRows.find(
                        (r) =>
                          r.columnId &&
                          colAccessor &&
                          r.columnId === colAccessor
                      ) ||
                      totalRows.find((r) => r.label === col.header) ||
                      totalRows.find(
                        (r) => r.label.toLowerCase() === headerLower
                      ) ||
                      totalRows.find(
                        (r) =>
                          r.label.toLowerCase().includes(headerLower) ||
                          (col.accessor === 'transactionsCount' &&
                            r.label.includes('FACTURAS')) ||
                          (col.accessor === 'totalTransactions' &&
                            r.label.includes('FACTURAS')) ||
                          (headerLower &&
                            r.label
                              .toLowerCase()
                              .includes(
                                headerLower.replace('total', '').trim()
                              ))
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
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-end'
                            }}
                          >
                            <span>{totalContent}</span>
                            <span
                              style={{
                                fontSize: '0.7em',
                                color: 'var(--text-muted)'
                              }}
                            >
                              {matchingTotal.percentage}
                            </span>
                          </div>
                        );
                      }
                    }
                  }

                  const isHighlighted = matchingTotal?.highlight;
                  const cellClassName =
                    `${className} ${isHighlighted ? 'total-cell--highlight' : ''}`.trim();

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
        <div
          className={`table-pagination-container ${!hasExports ? 'table-pagination-container--no-exports' : ''}`}
        >
          <div className="table-hide-unhide-columns">
            <Tooltip
              content={t(
                'common.table.hideUnhideColumns',
                'Ocultar/Mostrar columnas'
              )}
              position="top"
              followCursor={false}
              themeColor="primary"
            >
              <Button
                variant="dashed"
                color="amber"
                iconOnly
                size="xs"
                leftIcon={<HiViewGridAdd size={20} />}
                onClick={() => setIsColumnModalOpen(true)}
              />
            </Tooltip>
          </div>
          <div className="table-pagination-left">
            <span className="table-pagination-records">
              {t('common.table.totalRecords', {
                count: data.length,
                defaultValue: `Total: ${data.length}${hasMore ? '+' : ''}`
              })}
            </span>

            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            >
              <span
                className="table-pagination-records"
                style={{ opacity: 0.7, fontSize: '0.75rem' }}
              >
                {t('common.table.rowsPerPage', {
                  defaultValue: 'Mostrar:'
                })}
              </span>
              <Tooltip content={t('common.table.rowsPerPage', 'Mostrar:')}>
                <select
                  value={currentLimit}
                  onChange={(e) => {
                    setCurrentLimit(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="table-rows-select"
                >
                  {[5, 10, 15, 20, 50, 100].map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </Tooltip>
            </div>
          </div>

          <div className="table-pagination-center">
            {totalPages >= 1 && (
              <>
                <Tooltip content={t('common.pagination.first', 'Primera página')}>
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    <ChevronsLeft size={16} strokeWidth={2.5} />
                  </button>
                </Tooltip>
                <Tooltip content={t('common.pagination.previous', 'Anterior')}>
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    <ChevronLeft size={16} strokeWidth={2.5} />
                  </button>
                </Tooltip>
                <span className="table-pagination-page-text">
                  {t('common.pagination.page', {
                    current: currentPage,
                    total: hasMore ? `${totalPages}+` : totalPages
                  }) ||
                    `${currentPage} / ${hasMore ? totalPages + '+' : totalPages}`}
                </span>
                <Tooltip content={t('common.pagination.next', 'Siguiente')}>
                  <button
                    onClick={handleNext}
                    disabled={currentPage >= totalPages && !hasMore}
                    className="pagination-btn"
                  >
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                </Tooltip>
                <Tooltip content={t('common.pagination.last', 'Última página')}>
                  <button
                    onClick={() => {
                      if (totalPages > 0) setCurrentPage(totalPages);
                    }}
                    disabled={currentPage >= totalPages || hasMore}
                    className="pagination-btn"
                  >
                    <ChevronsRight size={16} strokeWidth={2.5} />
                  </button>
                </Tooltip>
              </>
            )}
          </div>

          {hasExports && (
            <div className="table-pagination-right">
              {onExportExcel && (
                <Tooltip
                  content={t('common.exportExcel', 'Exportar Excel')}
                  position="top"
                  followCursor={false}
                  themeColor="primary"
                >
                  <Button
                    onClick={onExportExcel}
                    variant="outline"
                    color="green"
                    iconOnly
                    size="xs"
                    disabled={data.length === 0}
                    leftIcon={ColoredIcons.Excel}
                  />
                </Tooltip>
              )}
              {onExportPdf && (
                <Tooltip
                  content={t('common.exportPdf', 'Exportar PDF')}
                  position="top"
                  followCursor={false}
                  themeColor="primary"
                >
                  <Button
                    onClick={onExportPdf}
                    variant="outline"
                    color="red"
                    iconOnly
                    size="xs"
                    disabled={data.length === 0}
                    leftIcon={ColoredIcons.Pdf}
                  />
                </Tooltip>
              )}
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        title={t(
          'common.table.manageColumns',
          'Mostrar/Ocultar columnas de la tabla'
        )}
        size="xxl"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: '2rem',
            minHeight: '60vh'
          }}
        >
          {/* Left Panel: Selection Menu */}
          <div
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '0.5rem'
                }}
              >
                <h4
                  style={{
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    margin: 0,
                    letterSpacing: '0.05em'
                  }}
                >
                  {t('common.table.columns', 'Columnas')}
                </h4>
              </div>
              <div
                style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem' }}
              >
                <button
                  onClick={handleSelectAllColumns}
                  className="table-columns-action-btn"
                  style={{
                    color: 'var(--accent)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {t('common.table.selectAll', 'Seleccionar Todo')}
                </button>
                <span style={{ color: 'var(--border-color)' }}>|</span>
                <button
                  onClick={handleClearAllColumns}
                  className="table-columns-action-btn"
                  style={{
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {t('common.table.clear', 'Limpiar')}
                </button>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                paddingRight: '0.5rem'
              }}
            >
              {columns.map((col, index) => {
                const key = getColumnKey(col, index);
                const isVisible = !draftHiddenColumns.has(key);

                const handleToggle = () => {
                  const newSet = new Set(draftHiddenColumns);
                  if (isVisible) {
                    if (draftVisibleColumns.length <= 1) return;
                    newSet.add(key);
                  } else {
                    newSet.delete(key);
                  }
                  setDraftHiddenColumns(newSet);
                };

                return (
                  <div
                    key={key}
                    onClick={handleToggle}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      backgroundColor: isVisible
                        ? 'color-mix(in srgb, var(--accent) 10%, transparent)'
                        : 'var(--surface-hover)',
                      borderRadius: 'var(--radius-md)',
                      cursor:
                        draftVisibleColumns.length <= 1 && isVisible
                          ? 'not-allowed'
                          : 'pointer',
                      opacity:
                        draftVisibleColumns.length <= 1 && isVisible ? 0.6 : 1,
                      border: isVisible
                        ? '1px solid color-mix(in srgb, var(--accent) 40%, transparent)'
                        : '1px solid var(--border-color)',
                      transition: 'all 0.2s ease',
                      boxShadow: isVisible ? 'none' : 'var(--shadow-sm)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={handleToggle}
                      disabled={draftVisibleColumns.length <= 1 && isVisible}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'inherit',
                        pointerEvents: 'none',
                        accentColor: 'var(--accent)'
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.95rem',
                        color: isVisible ? 'var(--accent)' : 'var(--text-main)',
                        userSelect: 'none',
                        fontWeight: isVisible ? 600 : 500
                      }}
                    >
                      {typeof col.header === 'string'
                        ? col.header
                        : `Columna ${index + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <Button
                variant="outline"
                color="success"
                onClick={() => {
                  setHiddenColumnKeys(new Set(draftHiddenColumns));
                  setIsColumnModalOpen(false);
                }}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {t('common.table.applyChanges', '✓ Aplicar Cambios')}
              </Button>
              <Button
                variant="outline"
                color="error"
                onClick={() => setIsColumnModalOpen(false)}
                style={{ width: '100%', justifyContent: 'center' }}
                leftIcon={<X />}
              >
                {t('common.cancel', 'X Cancelar')}
              </Button>
            </div>
          </div>

          {/* Right Panel: Table Preview (Document Outline) */}
          <div
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              border: '1px solid var(--border-color)',
              overflow: 'auto',
              maxHeight: '70vh',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h3
                style={{
                  color: 'var(--text-main)',
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {t('common.table.previewTitle', 'Vista Previa de la Tabla')}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {t(
                  'common.table.previewSubtitle',
                  'Resumen de columnas visibles'
                )}
              </p>
            </div>

            <div
              style={{
                overflowX: 'auto',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--table-border)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.85rem',
                  color: 'var(--text-main)'
                }}
              >
                <thead>
                  <tr>
                    {draftVisibleColumns.map((col, idx) => (
                      <th
                        key={idx}
                        style={{
                          backgroundColor: 'var(--table-header-bg)',
                          color: 'var(--table-header-text)',
                          padding: '12px 16px',
                          textAlign: 'left',
                          fontWeight: 600,
                          borderBottom: '2px solid var(--table-border)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data
                    .slice(0, Math.min(6, data.length || 6))
                    .map((item, rowIdx) => (
                      <tr
                        key={rowIdx}
                        style={{
                          backgroundColor:
                            rowIdx % 2 === 0
                              ? 'transparent'
                              : 'var(--table-row-striped)',
                          borderBottom: '1px solid var(--table-border)',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        {draftVisibleColumns.map((col, colIdx) => (
                          <td
                            key={colIdx}
                            style={{
                              padding: '12px 16px',
                              textAlign: col.isNumeric ? 'right' : 'inherit',
                              borderRight:
                                colIdx < draftVisibleColumns.length - 1
                                  ? '1px dashed var(--table-border)'
                                  : 'none',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {typeof col.accessor === 'function'
                              ? col.accessor(item)
                              : (item && item[col.accessor]) || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  {(!data || data.length === 0) && (
                    <tr>
                      <td
                        colSpan={draftVisibleColumns.length}
                        style={{
                          padding: '24px',
                          textAlign: 'center',
                          color: 'var(--text-muted)'
                        }}
                      >
                        {t(
                          'common.table.noDataPreview',
                          'No hay datos disponibles para la previsualización'
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
