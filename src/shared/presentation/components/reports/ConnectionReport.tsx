import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Table, type Column } from '../Table/Table';
import { Button } from '../Button/Button';
import { Avatar } from '../Avatar/Avatar';
import { ColorChip } from '../chip/ColorChip';
import { EmptyState } from '../common/EmptyState';
import { InputCadastralKey } from '../Input/InputCadastralKey';
import { Select } from '../Input/Select';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { HttpReportDashboardRepository } from '@/modules/dashboard/infrastructure/repositories/http-report-dashboard.repository';
import { GetConnectionLastReadingsReportUseCase } from '@/modules/dashboard/application/usecases/get-connection-last-readings-report.usecase';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import type { ConnectionLastReadingsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import type { ExportColumn } from './ReportPreviewModal';
import './ConnectionReport.css';

interface ConnectionReportProps {
  showToolbar?: boolean;
  showTable?: boolean;
  externalKey?: string;
  onKeyChange?: (key: string) => void;
}

export const ConnectionReport: React.FC<ConnectionReportProps> = ({
  showToolbar = true,
  showTable = true,
  externalKey,
  onKeyChange
}) => {
  const { t } = useTranslation();

  const [keyInternal, setKeyInternal] = useState<string>('1-1');
  const cadastralKey = externalKey ?? keyInternal;
  const setCadastralKey = onKeyChange ?? setKeyInternal;

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

  const handleSearch = useCallback(
    async (searchKey?: string, searchLimit?: number) => {
      const finalKey = searchKey || cadastralKey;
      const finalLimit = searchLimit || limit;
      if (!finalKey) return;

      setLoading(true);
      setData([]); // Reset to avoid stale data
      setHasSearched(false);

      try {
        const result = await useCase.execute(finalKey, finalLimit);
        setData(result || []);
        setHasSearched(true);
      } catch (error) {
        console.error('Error fetching connection report', error);
      } finally {
        setLoading(false);
      }
    },
    [cadastralKey, limit, useCase]
  );

  useEffect(() => {
    if (cadastralKey) {
      handleSearch(cadastralKey, limit);
    }
  }, [cadastralKey, limit, handleSearch]);

  const availableColumns = useMemo(
    () => [
      {
        id: 'date',
        label: t('dashboard.reports.connection.columns.date'),
        isDefault: true
      },
      {
        id: 'readingValue',
        label: t('dashboard.reports.connection.columns.readingValue'),
        isDefault: true
      },
      {
        id: 'consumption',
        label: t('dashboard.reports.connection.columns.consumption'),
        isDefault: true
      },
      {
        id: 'client',
        label: t('dashboard.reports.connection.columns.client'),
        isDefault: true
      },
      {
        id: 'meter',
        label: t('dashboard.reports.connection.columns.meter'),
        isDefault: true
      },
      {
        id: 'novelty',
        label: t('dashboard.reports.connection.columns.status', 'Novedad'),
        isDefault: true
      }
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
      const rowData: Record<string, string> = {
        date: dateService.formatToLocaleString(row.readingDate),
        readingValue: `$ ${row.readingValue}`,
        consumption: `${row.consumption} m³`,
        client: row.clientName || '-',
        meter: row.meterNumber || '-',
        novelty: row.novelty || '-'
      };

      return selectedCols.map((col) => rowData[col.id] || '-');
    },
    []
  );

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        value: acc.value + Number(item.readingValue || 0),
        consumption: acc.consumption + Number(item.consumption || 0)
      }),
      { value: 0, consumption: 0 }
    );
  }, [filteredData]);

  const totalRows = useMemo(
    () => [
      {
        label: t('common.totalRecords', 'Total registros'),
        value: filteredData.length,
        columnId: 'date'
      },
      {
        label: t('dashboard.reports.connection.columns.readingValue', 'Valor'),
        value: `$ ${Number(totals.value).toFixed(2)}`,
        highlight: false,
        columnId: 'readingValue'
      },
      {
        label: t('dashboard.reports.connection.columns.consumption', 'Consumo'),
        value: `${Number(totals.consumption).toFixed(2)} m³`,
        highlight: false,
        columnId: 'consumption'
      }
    ],
    [t, filteredData.length, totals]
  );

  const handleExportExcel = useCallback(() => {
    const selectedCols = availableColumns;
    const colLabels = selectedCols.map((c) => c.label);
    const rows = filteredData.map((d) => mapRowData(d, selectedCols));

    const totalsData = selectedCols.map((col, colIndex) => {
      if (colIndex === 0) return 'TOTAL';
      const matchingTotal = totalRows.find((r) => r.columnId === col.id);
      return matchingTotal ? String(matchingTotal.value) : '';
    });

    exportService.exportToExcel({
      rows,
      columns: colLabels,
      fileName: `reporte_conexion_${cadastralKey}`,
      title: t('dashboard.reports.connection.title', 'REPORTE DE CONEXIÓN'),
      totals: totalsData
    });
  }, [
    availableColumns,
    filteredData,
    mapRowData,
    totalRows,
    exportService,
    cadastralKey,
    t
  ]);

  const labelsHorizontal = useMemo(() => {
    if (data.length === 0) return undefined;
    const first = data[0];
    return {
      [t('dashboard.reports.connection.metadata.client', 'Client Name')]:
        first.clientName || '',
      [t(
        'dashboard.reports.connection.metadata.cadastralKey',
        'Cadastral Key'
      )]: first.cadastralKey || '',
      [t('dashboard.reports.connection.metadata.meter', 'Meter Number')]:
        first.meterNumber || '',
      [t('dashboard.reports.connection.metadata.address', 'Address')]:
        first.address || '',
      [t('common.exportDate', 'Fecha de Exportación')]:
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    };
  }, [data, t]);

  const { setShowPdfPreview, PdfPreviewModal } = useTablePdfExport({
    data: filteredData,
    availableColumns,
    reportTitle: t(
      'dashboard.reports.connection.title',
      'Historial de Lecturas'
    ),
    reportDescription: t(
      'dashboard.reports.connection.description',
      'Detalle histórico de lecturas por conexión'
    ),
    mapRowData,
    totalRows,
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
        className: 'font-medium',
        id: 'readingValue',
        isNumeric: true
      },
      {
        header: t('dashboard.reports.connection.columns.consumption'),
        accessor: (row) => `${row.consumption} m³`,
        id: 'consumption',
        isNumeric: true
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
      {showToolbar && (
        <div className="connection-report-toolbar">
          {/* Unified Search Row */}
          <div className="connection-toolbar-side">
            <label className="toolbar-label-compact">Connection</label>
            <div>
              <InputCadastralKey
                placeholder="Key (e.g. 1-1)"
                maxLength={15}
                size="compact"
                style={{ width: '100px' }}
                value={cadastralKey}
                onChange={(val) => setCadastralKey(val)}
              />
            </div>
            <div>
              <Select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                size="compact"
              >
                <option value={5}>Last 5</option>
                <option value={10}>Last 10</option>
                <option value={15}>Last 15</option>
                <option value={20}>Last 20</option>
                <option value={25}>Last 25</option>
                <option value={30}>Last 30</option>
              </Select>
            </div>
            <Button
              onClick={() => handleSearch()}
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
        </div>
      )}

      {showTable && (
        <Table
          data={filteredData}
          columns={columns}
          isLoading={loading}
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
          onExportPdf={() => setShowPdfPreview(true)}
          onExportExcel={handleExportExcel}
          totalRows={totalRows}
        />
      )}
      {showTable && PdfPreviewModal}
    </div>
  );
};
