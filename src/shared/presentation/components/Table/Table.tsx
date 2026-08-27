import React from 'react';
import '@/shared/presentation/styles/Table.css';
import '@/shared/presentation/styles/TableModal.css';
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
import { CircularProgress } from '../CircularProgress';
import { Select } from '../Input/Select';
import { TbFilter2Search } from 'react-icons/tb';
import type { FilterModel } from './types/TableFilter';
import { applyTableFilters } from './utils/filterUtils';
import { TableFilterModal } from './TableFilterModal';
import { TableSortModal } from './TableSortModal';


export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
  sortable?: boolean;
  sortKey?: keyof T;
  isNumeric?: boolean;
  id?: string;
  isColumnVisible?: boolean;
  filterValueGetter?: (item: T) => any;
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
  showColumnModal?: boolean;
  showTotalRecords?: boolean;
  showRowsPerPage?: boolean;
  showFilters?: boolean;
  filterModel?: FilterModel[];
  onFilterModelChange?: (model: FilterModel[]) => void;
  disableLocalFiltering?: boolean;
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
  hasMore,
  showColumnModal = true,
  showTotalRecords = true,
  showRowsPerPage = true,
  showFilters = true,
  filterModel,
  onFilterModelChange,
  disableLocalFiltering = false
}: TableProps<T>) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentLimit, setCurrentLimit] = React.useState(pageSize);
  const [hiddenColumnKeys, setHiddenColumnKeys] = React.useState<Set<string>>(
    () => {
      const initialHidden = new Set<string>();
      columns.forEach((col, index) => {
        if (col.isColumnVisible === false) {
          const key =
            col.id ||
            (typeof col.accessor === 'string' ? col.accessor : `col-${index}`);
          initialHidden.add(key);
        }
      });
      return initialHidden;
    }
  );
  const [isColumnModalOpen, setIsColumnModalOpen] = React.useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = React.useState<HTMLElement | null>(null);
  const [internalFilters, setInternalFilters] = React.useState<FilterModel[]>([]);


  const [isSortModalOpen, setIsSortModalOpen] = React.useState(false);
  const [sortAnchorEl, setSortAnchorEl] = React.useState<HTMLElement | null>(null);

  const filters = filterModel !== undefined ? filterModel : internalFilters;

  const handleFilterChange = React.useCallback(
    (newFilters: FilterModel[]) => {
      setInternalFilters(newFilters);
      onFilterModelChange?.(newFilters);
      setCurrentPage(1);
    },
    [onFilterModelChange]
  );

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

  const processedData = React.useMemo(() => {
    if (disableLocalFiltering || filters.length === 0) {
      return data;
    }
    return applyTableFilters(data, filters, columns);
  }, [data, filters, columns, disableLocalFiltering]);

  // Adjust page when data changes (e.g. new search or data refresh)
  React.useEffect(() => {
    const totalPages = Math.ceil(processedData.length / currentLimit);
    // Only reset if current page is out of bounds
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [processedData, currentLimit, currentPage]);

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
  const totalPages = Math.ceil(processedData.length / currentLimit);
  const paginatedData = pagination
    ? processedData.slice((currentPage - 1) * currentLimit, currentPage * currentLimit)
    : processedData;

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
      className={`table-container table--w-${width} ${fullHeight ? 'table--full-height' : ''
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
                  col.id ||
                  (typeof col.accessor === 'string' ? col.accessor : undefined);
                const isSorted = sortConfig?.key === sortKey;

                return (
                  <th
                    key={index}
                    className={`table-column-header ${col.className}`}
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
                const rowClassName = `table-row ${rowColor ? `table-row--${rowColor}` : ''
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
            {processedData && processedData.length > 0 && (
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
                  {isLoading ? (
                    <CircularProgress
                      label={t('common.loading', 'Loading...')}
                    />
                  ) : (
                    t('common.loading', 'Loading...')
                  )}
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
                className={`table-summary-row ${row.highlight ? 'table-summary-row--highlight' : ''
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
          {showColumnModal && (
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
          )}
          {columns.some(c => c.sortable) && onSort && (
            <div className="table-hide-unhide-columns">
              <Tooltip
                content={t('common.table.sortBy', 'Ordenar')}
                position="top"
                followCursor={false}
                themeColor="primary"
              >
                <Button
                  variant="dashed"
                  color="blue"
                  iconOnly
                  size="xs"
                  leftIcon={<ArrowUpDown size={20} />}
                  onClick={(e) => {
                    setSortAnchorEl(e.currentTarget);
                    setIsSortModalOpen(true);
                  }}
                />
              </Tooltip>
            </div>
          )}
          {showFilters && (
            <div className="table-hide-unhide-columns">
              <Tooltip
                content={t(
                  'common.table.filters',
                  'Filtros'
                )}
                position="top"
                followCursor={false}
                themeColor="primary"
              >
                <Button
                  variant="dashed"
                  color="warning"
                  iconOnly
                  size="xs"
                  leftIcon={<TbFilter2Search size={18} />}
                  onClick={(e) => {
                    setFilterAnchorEl(e.currentTarget);
                    setIsFilterModalOpen(true);
                  }}
                />
              </Tooltip>
            </div>
          )}
          <div className="table-pagination-left">
            {showTotalRecords && (
              <span className="table-pagination-records">
                {t('common.table.totalRecords', {
                  count: processedData.length,
                  defaultValue: `Total: ${processedData.length}${hasMore ? '+' : ''}`
                })}
              </span>
            )}

            {showRowsPerPage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <span
                  className="table-pagination-records"
                  style={{ opacity: 0.7, fontSize: '0.75rem' }}
                >
                  {t('common.table.rowsPerPage', {
                    defaultValue: 'Mostrar:'
                  })}
                </span>
                <Tooltip content={t('common.table.rowsPerPage', 'Mostrar:')} followCursor={false}>
                  <Select
                    value={currentLimit}
                    onChange={(e) => {
                      setCurrentLimit(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    size="small"
                  >
                    {[5, 10, 15, 20, 50, 100].map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </Select>
                </Tooltip>
              </div>
            )}
          </div>

          <div className="table-pagination-center">
            {totalPages >= 1 && (
              <>
                <Tooltip
                  followCursor={false}
                  content={t('common.pagination.first', 'Primera página')}
                >
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    <ChevronsLeft size={16} strokeWidth={2.5} />
                  </button>
                </Tooltip>
                <Tooltip
                  followCursor={false}
                  content={t('common.pagination.previous', 'Anterior')}>
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
                <Tooltip
                  followCursor={false}
                  content={t('common.pagination.next', 'Siguiente')}>
                  <button
                    onClick={handleNext}
                    disabled={currentPage >= totalPages && !hasMore}
                    className="pagination-btn"
                  >
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                </Tooltip>
                <Tooltip
                  followCursor={false}
                  content={t('common.pagination.last', 'Última página')}>
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
                    disabled={processedData.length === 0}
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
                    disabled={processedData.length === 0}
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
        <div className="table-modal-container">
          {/* Left Panel: Selection Menu */}
          <div className="table-modal-left-panel">
            <div className="table-modal-left-header">
              <div className="table-modal-left-title">
                <h4 className="table-modal-columns-label">
                  {t('common.table.columns', 'Columnas')}
                </h4>
              </div>
              <div className="table-modal-header-actions">
                <button
                  onClick={handleSelectAllColumns}
                  className="table-columns-action-btn select-all"
                >
                  {t('common.table.selectAll', 'Seleccionar Todo')}
                </button>
                <span style={{ color: 'var(--border-color)' }}>|</span>
                <button
                  onClick={handleClearAllColumns}
                  className="table-columns-action-btn clear"
                >
                  {t('common.table.clear', 'Limpiar')}
                </button>
              </div>
            </div>

            <div className="table-modal-checkbox-list">
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
                    className={`table-modal-checkbox-item ${isVisible ? 'visible' : ''} ${draftVisibleColumns.length <= 1 && isVisible ? 'disabled' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={handleToggle}
                      disabled={draftVisibleColumns.length <= 1 && isVisible}
                      className="table-modal-checkbox-input"
                    />
                    <span
                      className={`table-modal-checkbox-label ${isVisible ? 'visible' : ''}`}
                    >
                      {typeof col.header === 'string'
                        ? col.header
                        : `Columna ${index + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="table-modal-footer-actions">
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
          <div className="table-modal-right-panel">
            <div className="table-modal-preview-header">
              <h3 className="table-modal-preview-title">
                {t('common.table.previewTitle', 'Vista Previa de la Tabla')}
              </h3>
              <p className="table-modal-preview-subtitle">
                {t(
                  'common.table.previewSubtitle',
                  'Resumen de columnas visibles'
                )}
              </p>
            </div>

            <div className="table-modal-preview-wrapper">
              <table className="table-modal-preview-table">
                <thead>
                  <tr>
                    {draftVisibleColumns.map((col, idx) => (
                      <th key={idx} className="table-modal-preview-th">
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
                        className={`table-modal-preview-row ${rowIdx % 2 !== 0 ? 'striped' : ''}`}
                      >
                        {draftVisibleColumns.map((col, colIdx) => (
                          <td
                            key={colIdx}
                            className={`table-modal-preview-td ${colIdx < draftVisibleColumns.length - 1 ? 'dashed-border' : ''}`}
                            style={{
                              textAlign: col.isNumeric ? 'right' : 'inherit'
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
                        className="table-modal-preview-empty"
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

      <TableFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => {
          setIsFilterModalOpen(false);
          setFilterAnchorEl(null);
        }}
        columns={columns}
        initialFilters={filters}
        onApply={handleFilterChange}
        getColumnKey={getColumnKey}
        anchorElement={filterAnchorEl}
      />
      {isSortModalOpen && (
        <TableSortModal
          isOpen={isSortModalOpen}
          onClose={() => {
            setIsSortModalOpen(false);
            setSortAnchorEl(null);
          }}
          columns={columns}
          sortConfig={sortConfig || null}
          onSort={(key, dir) => onSort?.(key, dir)}
          anchorElement={sortAnchorEl}
        />
      )}
    </div>
  );
};
