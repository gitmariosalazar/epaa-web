import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect
} from 'react';
import { createPortal } from 'react-dom';
import {
  Table,
  type Column
} from '../../../../shared/presentation/components/Table/Table';
import { Button } from '../../../../shared/presentation/components/Button/Button';
import { Avatar } from '../../../../shared/presentation/components/Avatar/Avatar';
import { type ExportColumn } from '../../../../shared/presentation/components/reports/ReportPreviewModal';
import { useTablePdfExport } from '../../../../shared/presentation/hooks/useTablePdfExport';
import { useTranslation } from 'react-i18next';
import { EyeIcon } from 'lucide-react';
import { FaList, FaUser } from 'react-icons/fa';
import { Tooltip } from '../../../../shared/presentation/components/common/Tooltip/Tooltip';
import { EmptyState } from '../../../../shared/presentation/components/common/EmptyState';
import type { OverduePayment } from '../../domain/models/OverdueReading';
import type { SortConfig } from '../hooks/useOverduePaymentsViewModel';
import { OverduePaymentDetailModal } from './OverduePaymentDetailModal';
import '../styles/OverduePaymentsTable.css';
import { truncateText } from '@/shared/presentation/utils/text/truncate-text';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';

// ── Props ─────────────────────────────────────────────────────────────────────
interface OverduePaymentsTableProps {
  data: OverduePayment[];
  isLoading: boolean;
  sortConfig?: SortConfig | null;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onEndReached?: () => void;
  onViewPendingReadings: (clientId: string) => void;
  hasMore?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
export const OverduePaymentsTable: React.FC<OverduePaymentsTableProps> = ({
  data,
  isLoading,
  sortConfig,
  onSort,
  onEndReached,
  onViewPendingReadings,
  hasMore
}) => {
  const { t } = useTranslation();
  const loadingProgress = useSimulatedProgress(isLoading);
  const [selectedItem, setSelectedItem] = useState<OverduePayment | null>(null);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);
  const [menuPlacement, setMenuPlacement] = useState<'down' | 'up'>('down');
  const [menuHorizontal, setMenuHorizontal] = useState<'left' | 'right'>(
    'right'
  );
  const [menuCoords, setMenuCoords] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If clicking a toggle button, let handleMenuToggle handle it
      if ((event.target as HTMLElement).closest('.menu-toggle-btn')) {
        return;
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        console.log('Closing menu because click was outside:', event.target);
        setActiveMenuRowId(null);
        setMenuCoords(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleMenuToggle = (
    e: React.MouseEvent,
    row: OverduePayment & { _tempId?: string }
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const rowUniqueKey = row._tempId || `${row.clientId}-${row.cadastralKey}`;

    if (activeMenuRowId === rowUniqueKey) {
      setActiveMenuRowId(null);
      setMenuCoords(null);
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceRight = window.innerWidth - rect.right;
      const isUp = spaceBelow < 180;
      const isRightToLeft = spaceRight < 200;

      setMenuPlacement(isUp ? 'up' : 'down');
      setMenuHorizontal(isRightToLeft ? 'right' : 'left');

      setMenuCoords({
        top: isUp ? rect.top + window.scrollY : rect.bottom + window.scrollY,
        left: isRightToLeft
          ? rect.right + window.scrollX
          : rect.left + window.scrollX
      });
      setActiveMenuRowId(rowUniqueKey);
    }
  };

  const fmt = (val: number | undefined) =>
    val !== undefined ? `$${val.toFixed(2)}` : '-';

  // Inject a unique ID to each row based on its index and data
  const dataWithIds = useMemo(() => {
    return data.map((item: OverduePayment, index: number) => ({
      ...item,
      _tempId: `${item.clientId}-${item.cadastralKey}-${index}`
    }));
  }, [data]);

  // ── Columns ──────────────────────────────────────────────────────────────
  const columns: Column<any & { _tempId: string }>[] = useMemo(
    () => [
      {
        header: t('accounting.overdue.clientId', 'ID Cliente'),
        accessor: (item: OverduePayment) => (
          <div className="client-id-cell">
            <Avatar name={item.name || item.clientId} size="sm" />
            <div className="client-id-details">
              <div className="client-id-text">{item.clientId}</div>
              <div className="client-name-text">{truncateText(item.name)}</div>
            </div>
          </div>
        ),
        id: 'clientId',
        sortable: true,
        sortKey: 'clientId',
        style: { width: '180px', minWidth: '180px' }
      },
      {
        header: t('accounting.overdue.cadastralKey', 'Clave Catastral'),
        accessor: 'cadastralKey',
        sortable: true,
        id: 'cadastralKey',
        sortKey: 'cadastralKey',
        style: { width: '100px', textAlign: 'center' }
      },
      {
        header: t('accounting.overdue.monthsPastDue', 'Meses de mora'),
        accessor: (item: OverduePayment) => (
          <span
            className={`months-past-due-badge ${
              item.monthsPastDue >= 6
                ? 'past-due-critical'
                : item.monthsPastDue >= 3
                  ? 'past-due-warning'
                  : ''
            }`}
          >
            {item.monthsPastDue}
          </span>
        ),
        sortable: true,
        id: 'monthsPastDue',
        sortKey: 'monthsPastDue',
        style: { width: '100px', textAlign: 'center' }
      },
      {
        header: t('accounting.overdue.totalTrashRate', 'Tasa Basura'),
        accessor: (item: OverduePayment) => fmt(item.totalTrashRate),
        sortable: true,
        id: 'totalTrashRate',
        sortKey: 'totalTrashRate',
        isNumeric: true,
        style: { width: '100px' }
      },
      {
        header: t('accounting.overdue.totalEpaaValue', 'Valor EPAA'),
        accessor: (item: OverduePayment) => fmt(item.totalEpaaValue),
        sortable: true,
        id: 'totalEpaaValue',
        sortKey: 'totalEpaaValue',
        isNumeric: true,
        style: { width: '110px' }
      },
      {
        header: t('accounting.overdue.totalSurcharge', 'Recargo'),
        accessor: (item: OverduePayment) => fmt(item.totalSurcharge),
        sortable: true,
        id: 'totalSurcharge',
        sortKey: 'totalSurcharge',
        isNumeric: true,
        style: { width: '100px' }
      },
      {
        header: t('accounting.overdue.totalDue', 'Total'),
        accessor: (item: OverduePayment) => {
          const total = item.totalDue ?? 0;
          return <span className="total-due-text">${total.toFixed(2)}</span>;
        },
        id: 'totalDue',
        sortable: true,
        sortKey: 'totalDue',
        isNumeric: true,
        style: { width: '110px' }
      },
      {
        header: t('connections.table.options', 'Opciones'),
        accessor: (row: OverduePayment & { _tempId: string }) => (
          <div className="conn-table-actions">
            <Tooltip
              content={t('connections.table.viewDetails', 'Ver detalle')}
              position="top"
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedItem(row)}
                circle
                className="btn-view-details"
              >
                <EyeIcon size={14} />
              </Button>
            </Tooltip>

            <div className="table-actions-dropdown-container">
              {(() => {
                const rowUniqueKey = row._tempId;
                return (
                  <Tooltip
                    content={t(
                      'accounting.overdue.viewPendingReadings',
                      'Ver lecturas pendientes'
                    )}
                    position="top"
                    disabled={activeMenuRowId === rowUniqueKey}
                  >
                    <div
                      ref={activeMenuRowId === rowUniqueKey ? menuRef : null}
                      className="menu-button-wrapper"
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                        className="menu-toggle-btn btn-view-pending-list"
                        onClick={(e) => handleMenuToggle(e, row)}
                        circle
                      >
                        <FaList size={14} />
                      </Button>

                      {activeMenuRowId === rowUniqueKey &&
                        menuCoords &&
                        createPortal(
                          <div
                            ref={menuRef}
                            className={`table-actions-menu ${menuPlacement === 'up' ? 'menu-up' : ''}`}
                            style={
                              {
                                '--menu-top': `${menuCoords.top}px`,
                                '--menu-left': `${menuCoords.left}px`,
                                '--menu-transform':
                                  menuPlacement === 'up'
                                    ? menuHorizontal === 'right'
                                      ? 'translate(-100%, -100%)'
                                      : 'translate(0, -100%)'
                                    : menuHorizontal === 'right'
                                      ? 'translateX(-100%)'
                                      : 'translateX(0)'
                              } as React.CSSProperties
                            }
                          >
                            <div className="menu-info-header-pending">
                              <div className="menu-info-subtitle">
                                <p>C.I:</p>
                                <span>{row.clientId}</span>
                              </div>
                              <div className="menu-info-subtitle">
                                <p>C.C:</p>
                                <span>{row.cadastralKey}</span>
                              </div>
                            </div>

                            {/* Por Clave Catastral */}
                            {row.cadastralKey &&
                              row.cadastralKey !== '0' &&
                              row.cadastralKey.trim() !== '' && (
                                <div
                                  className="menu-item"
                                  onClick={(e) => {
                                    console.log(
                                      'Clicked: Por Clave Catastral',
                                      { val: row.cadastralKey }
                                    );
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const val = row.cadastralKey;
                                    // NO cerramos el menú aquí para ver el Loading en toda la página
                                    // Llamamos directamente (sin setTimeout)
                                    setActiveMenuRowId(null);
                                    onViewPendingReadings(val);
                                  }}
                                >
                                  <FaList size={12} />
                                  <span>Por Clave Catastral</span>
                                </div>
                              )}

                            {/* Por ID Cliente (Todo) */}
                            <div
                              className="menu-item"
                              onClick={(e) => {
                                console.log('Clicked: Por ID Cliente (Todo)', {
                                  val: row.clientId
                                });
                                e.stopPropagation();
                                e.preventDefault();
                                // NO cerramos el menú aquí para ver el Loading en toda la página
                                // Llamamos directamente
                                setActiveMenuRowId(null);
                                onViewPendingReadings(row.clientId);
                              }}
                            >
                              <FaUser size={12} />
                              <span>Por ID Cliente (Todo)</span>
                            </div>
                          </div>,
                          document.body
                        )}
                    </div>
                  </Tooltip>
                );
              })()}
            </div>
          </div>
        ),
        id: 'actions',
        className: 'actions-column',
        style: { width: '100px', textAlign: 'center' }
      }
    ],
    [t, onViewPendingReadings, activeMenuRowId]
  );

  const totals = useMemo(() => {
    const defaultTotals = {
      totalValue: 0,
      totalTrashRate: 0,
      totalEpaaValue: 0,
      totalSurcharge: 0,
      totalOldSurcharge: 0,
      totalOldImprovementsInterest: 0
    };

    return data.reduce((acc: typeof defaultTotals, item: OverduePayment) => {
      acc.totalValue +=
        (Number(item.totalTrashRate) || 0) +
        (Number(item.totalEpaaValue) || 0) +
        (Number(item.totalSurcharge) || 0) +
        (Number(item.totalOldSurcharge) || 0) +
        (Number(item.totalOldImprovementsInterest) || 0);
      acc.totalTrashRate += Number(item.totalTrashRate) || 0;
      acc.totalEpaaValue += Number(item.totalEpaaValue) || 0;
      acc.totalSurcharge += Number(item.totalSurcharge) || 0;
      acc.totalOldSurcharge += Number(item.totalOldSurcharge) || 0;
      acc.totalOldImprovementsInterest +=
        Number(item.totalOldImprovementsInterest) || 0;
      return acc;
    }, defaultTotals);
  }, [data]);

  const {
    totalValue,
    totalTrashRate,
    totalEpaaValue,
    totalSurcharge,
    totalOldSurcharge,
    totalOldImprovementsInterest
  } = totals;

  const handleMapRowData = useCallback(
    (item: OverduePayment, selectedCols: ExportColumn[]) => {
      const total =
        (Number(item.totalTrashRate) || 0) +
        (Number(item.totalEpaaValue) || 0) +
        (Number(item.totalSurcharge) || 0) +
        (Number(item.totalOldSurcharge) || 0) +
        (Number(item.totalOldImprovementsInterest) || 0);

      const rowData: Record<string, string> = {
        clientId: item.clientId ?? '-',
        name: item.name ?? '-',
        cadastralKey: item.cadastralKey ?? '-',
        monthsPastDue: String(item.monthsPastDue ?? '-'),
        totalTrashRate: fmt(item.totalTrashRate),
        totalEpaaValue: fmt(item.totalEpaaValue),
        totalSurcharge: fmt(item.totalSurcharge),
        totalDue: `$${total.toFixed(2)}`
      };

      return selectedCols.map(
        (col) => rowData[col.id as keyof typeof rowData] || '-'
      );
    },
    []
  );

  const availableColumns = useMemo(
    () => [
      {
        id: 'clientId',
        label: t('accounting.overdue.clientId', 'ID Cliente'),
        isDefault: true
      },
      {
        id: 'name',
        label: t('accounting.overdue.name', 'Nombre'),
        isDefault: true
      },
      {
        id: 'cadastralKey',
        label: t('accounting.overdue.cadastralKey', 'Clave Catastral'),
        isDefault: true
      },
      {
        id: 'monthsPastDue',
        label: t('accounting.overdue.monthsPastDue', 'Meses de mora'),
        isDefault: true
      },
      {
        id: 'totalTrashRate',
        label: t('accounting.overdue.totalTrashRate', 'Tasa Basura'),
        isDefault: true
      },
      {
        id: 'totalEpaaValue',
        label: t('accounting.overdue.totalEpaaValue', 'Valor EPAA'),
        isDefault: true
      },
      {
        id: 'totalSurcharge',
        label: t('accounting.overdue.totalSurcharge', 'Recargo'),
        isDefault: true
      },
      {
        id: 'totalDue',
        label: t('accounting.overdue.totalDue', 'Total'),
        isDefault: true
      }
    ],
    [t]
  );

  const totalRows = useMemo(
    () => [
      {
        label: t('accounting.overdue.totalRecords', 'Total registros'),
        value: data.length,
        highlight: false,
        columnId: 'clientId'
      },
      {
        label: t('accounting.overdue.totalValue', 'Total'),
        value: totalValue,
        highlight: true,
        columnId: 'totalDue'
      },
      {
        label: t('accounting.overdue.totalTrashRate', 'Total Tasa Basura'),
        value: totalTrashRate,
        highlight: false,
        columnId: 'totalTrashRate'
      },
      {
        label: t('accounting.overdue.totalEpaaValue', 'Total Valor EPAA'),
        value: totalEpaaValue,
        highlight: false,
        columnId: 'totalEpaaValue'
      },
      {
        label: t('accounting.overdue.totalSurcharge', 'Total Recargo'),
        value: totalSurcharge,
        highlight: false,
        columnId: 'totalSurcharge'
      },
      {
        label: t(
          'accounting.overdue.totalOldSurcharge',
          'Total Recargo Antiguo'
        ),
        value: totalOldSurcharge,
        highlight: false,
        columnId: 'totalOldSurcharge'
      },
      {
        label: t(
          'accounting.overdue.totalOldImprovementsInterest',
          'Total Intereses Antiguos'
        ),
        value: totalOldImprovementsInterest,
        highlight: false,
        columnId: 'totalOldImprovementsInterest'
      }
    ],
    [
      t,
      data.length,
      totalValue,
      totalTrashRate,
      totalEpaaValue,
      totalSurcharge,
      totalOldSurcharge,
      totalOldImprovementsInterest
    ]
  );

  const labelsHorizontal = useMemo(
    () => ({
      [t('readings.historyTable.date', 'Fecha de generación')]:
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    }),
    [t]
  );

  const { setShowPdfPreview, PdfPreviewModal } =
    useTablePdfExport<OverduePayment>({
      data,
      availableColumns,
      reportTitle: t(
        'accounting.overdue.reportTitle',
        'Reporte de Pagos en Mora'
      ),
      reportDescription: t(
        'accounting.overdue.reportSubtitle',
        'Listado de conexiones con pagos pendientes'
      ),
      labelsHorizontal,
      totalRows,
      mapRowData: handleMapRowData
    });

  return (
    <div className={`payments-table-wrapper ${isLoading ? 'is-loading' : ''}`}>
      {isLoading && data.length > 0 && (
        <div className="table-loading-overlay">
          <CircularProgress
            progress={loadingProgress}
            size={90}
            strokeWidth={7}
            label={t('common.loading', 'Cargando...')}
          />
        </div>
      )}
      <Table
        data={dataWithIds}
        columns={columns}
        isLoading={isLoading}
        pagination
        pageSize={15}
        onSort={onSort ? (key, direction) => onSort(String(key), direction as 'asc' | 'desc') : undefined}
        sortConfig={sortConfig}
        onExportPdf={() => {
          setShowPdfPreview(true);
        }}
        onEndReached={onEndReached}
        hasMore={hasMore}
        totalRows={totalRows}
        width="100"
        fullHeight
        emptyState={
          <EmptyState
            message={t('accounting.overdue.noData', 'Sin registros en mora')}
            description={t(
              'accounting.overdue.noDataDescription',
              'No se encontraron conexiones con pagos pendientes.'
            )}
          />
        }
      />

      <OverduePaymentDetailModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        onViewPendingReadings={onViewPendingReadings}
        item={selectedItem}
      />
      {PdfPreviewModal}
    </div>
  );
};
