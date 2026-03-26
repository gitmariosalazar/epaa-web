import { useState, useMemo, useEffect } from 'react';
import type { ConnectionLastReadingsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { GetConnectionLastReadingsReportUseCase } from '@/modules/dashboard/application/usecases/get-connection-last-readings-report.usecase';
import { HttpReportDashboardRepository } from '@/modules/dashboard/infrastructure/repositories/http-report-dashboard.repository';
import { Search } from 'lucide-react';
import { Button } from '../Button/Button';
import { ColoredIcons } from '../../utils/icons/CustomIcons';
import { ColorChip } from '../chip/ColorChip';
import { EmptyState } from '../common/EmptyState';
import { Table, type Column } from '../Table/Table';
import { Avatar } from '../Avatar/Avatar';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { useTranslation } from 'react-i18next';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import type { ExportColumn } from './ReportPreviewModal';
import { useCallback } from 'react';
import './ConnectionReport.css';

export const ConnectionReport = () => {
  const { t } = useTranslation();
  const [cadastralKey, setCadastralKey] = useState<string>('1-1');
  const [limit, setLimit] = useState<number>(15);
  const [data, setData] = useState<ConnectionLastReadingsReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [resultSearchTerm, setResultSearchTerm] = useState('');

  const repository = useMemo(() => new HttpReportDashboardRepository(), []);
  const exportService = useMemo(() => new ExportService(), []);

  const useCase = useMemo(
    () => new GetConnectionLastReadingsReportUseCase(repository),
    [repository]
  );

  const handleSearch = async () => {
    if (!cadastralKey) return;
    setLoading(true);
    try {
      const result = await useCase.execute(cadastralKey, limit);
      setData(result);
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching connection report', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const AVAILABLE_COLUMNS: ExportColumn[] = useMemo(
    () => [
      { columnId: 'date', id: 'date', label: t('dashboard.reports.connection.columns.date'), isDefault: true },
      { columnId: 'readingValue', id: 'readingValue', label: t('dashboard.reports.connection.columns.readingValue'), isDefault: true },
      { columnId: 'consumption', id: 'consumption', label: t('dashboard.reports.connection.columns.consumption'), isDefault: true },
      { columnId: 'client', id: 'client', label: t('dashboard.reports.connection.columns.client'), isDefault: true },
      { columnId: 'meter', id: 'meter', label: t('dashboard.reports.connection.columns.meter'), isDefault: true },
      { columnId: 'status', id: 'status', label: t('dashboard.reports.connection.columns.status'), isDefault: true }
    ],
    [t]
  );

  const filteredData = useMemo(() => {
    if (!resultSearchTerm) return data;
    const lowerTerm = resultSearchTerm.toLowerCase();
    return data.filter(
      (row) =>
        (row.clientName || '').toLowerCase().includes(lowerTerm) ||
        (row.meterNumber || '').toLowerCase().includes(lowerTerm) ||
        dateService
          .formatToLocaleString(row.readingDate)
          .includes(resultSearchTerm)
    );
  }, [data, resultSearchTerm]);

  const mapRowData = useCallback(
    (row: ConnectionLastReadingsReport, selectedCols: ExportColumn[]) => {
      try {
        const rowData: Record<string, string> = {
          date: dateService.formatToLocaleString(row.readingDate),
          readingValue: row.readingValue.toString(),
          consumption: `${row.consumption} m³`,
          clientName: row.clientName,
          meterNumber: row.meterNumber,
          novelty: row.novelty
        };

        return selectedCols.map((col) => {
          const key = (col.columnId || col.id) as keyof typeof rowData;
          return rowData[key] || '-';
        });
      } catch (error) {
        console.error('Error mapping connection row data:', error);
        return selectedCols.map(() => '-');
      }
    },
    []
  );

  const labelsHorizontal = useMemo(() => {
    if (data.length === 0) return undefined;
    const first = data[0];
    return {
      [t('dashboard.reports.connection.metadata.client', 'Client Name')]: first.clientName || '',
      [t('dashboard.reports.connection.metadata.cadastralKey', 'Cadastral Key')]: first.cadastralKey || '',
      [t('dashboard.reports.connection.metadata.meter', 'Meter Number')]: first.meterNumber || '',
      [t('dashboard.reports.connection.metadata.address', 'Address')]: first.address || '',
      [t('common.exportDate', 'Fecha de Exportación')]: 
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    };
  }, [data, t]);

  const {
    setShowPdfPreview,
    PdfPreviewModal
  } = useTablePdfExport({
    data: filteredData,
    availableColumns: AVAILABLE_COLUMNS,
    reportTitle: t('dashboard.reports.connection.title', 'Historial de Lecturas'),
    reportDescription: t('dashboard.reports.connection.description', 'Detalle histórico de lecturas por conexión'),
    mapRowData,
    labelsHorizontal
  });


  const columns = useMemo<Column<ConnectionLastReadingsReport>[]>(
    () => [
      {
        header: t('dashboard.reports.connection.columns.date'),
        accessor: (row) => dateService.formatToLocaleString(row.readingDate)
      },
      {
        header: t('dashboard.reports.connection.columns.readingValue'),
        accessor: 'readingValue',
        className: 'font-medium'
      },
      {
        header: t('dashboard.reports.connection.columns.consumption'),
        accessor: (row) => `${row.consumption} m³`
      },
      {
        header: t('dashboard.reports.connection.columns.client'),
        accessor: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar name={row.clientName} size="sm" />
            <div>
              <div style={{ fontWeight: 300 }}>{row.clientName}</div>
              <div
                style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}
              >
                {row.clientId}
              </div>
            </div>
          </div>
        )
      },
      {
        header: t('dashboard.reports.connection.columns.meter'),
        accessor: 'meterNumber'
      },
      {
        header: t('dashboard.reports.connection.columns.status'),
        accessor: (row) => (
          <ColorChip
            color={
              row.novelty === 'NORMAL' || row.novelty === 'LECTURA NORMAL'
                ? 'var(--success)'
                : 'var(--warning)'
            }
            label={row.novelty}
            size="sm"
            variant="soft"
          />
        )
      }
    ],
    []
  );

  return (
    <div className="connection-report-container">
      <div className="connection-report-toolbar">
        {/* Unified Search Row */}
        <div className="connection-toolbar-side">
          <label className="toolbar-label-compact">Connection</label>
          <input
            type="text"
            className="toolbar-input-compact"
            placeholder="Key (e.g. 1-1)"
            maxLength={15}
            style={{ width: '100px' }}
            value={cadastralKey}
            onChange={(e) => setCadastralKey(e.target.value)}
          />
          <select
            className="toolbar-select-compact"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={5}>Last 5</option>
            <option value={10}>Last 10</option>
            <option value={15}>Last 15</option>
            <option value={20}>Last 20</option>
            <option value={25}>Last 25</option>
            <option value={30}>Last 30</option>
          </select>
          <Button
            onClick={handleSearch}
            isLoading={loading}
            leftIcon={<Search size={14} />}
            size="sm"
            color="primary"
          >
            History
          </Button>

          {data.length > 0 && (
            <div className="filter-search-wrapper">
              <Search size={12} />
              <input
                type="text"
                className="toolbar-input-compact"
                placeholder="Filter results..."
                maxLength={60}
                value={resultSearchTerm}
                onChange={(e) => setResultSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="connection-toolbar-side actions">
          <Button
            variant="outline"
            color="red"
            size="sm"
            iconOnly
            leftIcon={ColoredIcons.Pdf}
            onClick={() => setShowPdfPreview(true)}
            disabled={loading || data.length === 0}
            title={t('common.exportPdf', 'Export PDF')}
          />
          <Button
            variant="outline"
            color="green"
            size="sm"
            iconOnly
            leftIcon={ColoredIcons.Excel}
            onClick={() => {
              exportService.exportToExcel(
                filteredData,
                'connection_history'
              );
            }}
            disabled={loading || data.length === 0}
            title={t('common.exportExcel', 'Export Excel')}
          />
        </div>
      </div>

      <Table
        data={filteredData}
        columns={columns}
        pagination={true}
        pageSize={15}
        emptyState={
          hasSearched ? (
            <EmptyState
              message="No history found"
              description={`No history found for ${cadastralKey}`}
            />
          ) : (
            <EmptyState
              message="Enter a Cadastral Key"
              description="Enter a Cadastral Key to search history."
            />
          )
        }
      />
      {PdfPreviewModal}
    </div>
  );
};
