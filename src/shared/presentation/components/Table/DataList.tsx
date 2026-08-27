import React from 'react';
import '@/shared/presentation/styles/Table.css';
import '@/shared/presentation/styles/TableModal.css';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SearchX,
  X,
  ArrowUpDown
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

export interface DataListProps<T> {
  data: T[];
  columns: Column<T>[];
  renderItem: (item: T, index: number, visibleColumns: Column<T>[]) => React.ReactNode;
  gridClassName?: string;
  isLoading?: boolean;
  loadingState?: React.ReactNode;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  pagination?: boolean;
  pageSize?: number;
  emptyState?: React.ReactNode;
  sortConfig?: { key: keyof T | string; direction: 'asc' | 'desc' } | null;
  onSort?: (key: keyof T | string, direction: 'asc' | 'desc') => void;
  width?: '100' | '70' | '50' | 'auto';
  fullHeight?: boolean;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
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

export const DataList = <T extends { [key: string]: any }>({
  data,
  columns,
  renderItem,
  gridClassName = '',
  isLoading,
  loadingState,
  containerClassName = '',
  containerStyle = {},
  pagination = false,
  pageSize = 15,
  emptyState,
  sortConfig,
  onSort,
  width = '100',
  fullHeight = true,
  onExportPdf,
  onExportExcel,
  onEndReached,
  hasMore,
  showColumnModal = true,
  showTotalRecords = true,
  showRowsPerPage = true,
  showFilters = true,
  filterModel,
  onFilterModelChange,
  disableLocalFiltering = false
}: DataListProps<T>) => {
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
  const [isSortModalOpen, setIsSortModalOpen] = React.useState(false);
  const [sortAnchorEl, setSortAnchorEl] = React.useState<HTMLElement | null>(null);
  const [filterAnchorEl, setFilterAnchorEl] = React.useState<HTMLElement | null>(null);
  const [internalFilters, setInternalFilters] = React.useState<FilterModel[]>([]);

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
      className={`table-container-data-list table--w-${width} ${fullHeight ? 'table--full-height' : ''
        } ${containerClassName}`}
      style={containerStyle}
    >
      <div className="table-body-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>


        <div className={`data-list-grid ${gridClassName}`}>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {renderItem(item, rowIndex, visibleColumns)}
              </React.Fragment>
            ))
          ) : (
            <div className="empty-state-cell" style={{ gridColumn: '1 / -1', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isLoading ? loadingState || (
                <div className="table-loader">
                  <div className="spinner"></div>
                  {t('common.table.loading')}
                </div>
              ) : emptyState || (
                <div className="default-empty-state">
                  <EmptyState message={t('common.table.noData')} icon={SearchX} minHeight="300px" />
                </div>
              )}
            </div>
          )}

          {onEndReached && hasMore && !pagination && (
            <div ref={observerTarget} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '10px', color: 'var(--text-muted)' }}>
              {isLoading ? <CircularProgress label={t('common.loading', 'Loading...')} /> : t('common.loading', 'Loading...')}
            </div>
          )}
        </div>
      </div>

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

      {isFilterModalOpen && (
        <TableFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          columns={columns}
          initialFilters={filters}
          onApply={handleFilterChange}
          anchorElement={filterAnchorEl}
          getColumnKey={getColumnKey}
        />
      )}

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
