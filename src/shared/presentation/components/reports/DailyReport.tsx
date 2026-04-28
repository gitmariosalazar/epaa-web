import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Table, type Column } from '../Table/Table';
import type { DailyReadingsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { GetDailyReadingsReportUseCase } from '@/modules/dashboard/application/usecases/get-daily-readings-report.usecase';
import { HttpReportDashboardRepository } from '@/modules/dashboard/infrastructure/repositories/http-report-dashboard.repository';
import { ColorChip } from '../chip/ColorChip';
import { EmptyState } from '../common/EmptyState';
import { getNoveltyColor } from '../../utils/colors/novelties.colors';

import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import { Avatar } from '../Avatar/Avatar';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '../DatePicker/DatePicker';
import './DailyReport.css';
import { Button } from '../Button/Button';
import type { ExportColumn } from './ReportPreviewModal';
import { truncateText } from '../../../utils/text/truncate-text';
import { IoInformationCircleOutline } from 'react-icons/io5';

interface DailyReportProps {
  showToolbar?: boolean;
  showTable?: boolean;
  externalDate?: string;
  onDateChange?: (date: string) => void;
}

export const DailyReport: React.FC<DailyReportProps> = ({
  showToolbar = true,
  showTable = true,
  externalDate,
  onDateChange
}) => {
  const { t } = useTranslation();

  const [dateInternal, setDateInternal] = useState<string>(
    dateService.getCurrentDateString()
  );

  const date = externalDate ?? dateInternal;
  const setDate = onDateChange ?? setDateInternal;

  const availableColumns = useMemo(
    () => [
      {
        id: 'time',
        label: t('dashboard.reports.daily.columns.time'),
        isDefault: true
      },
      {
        id: 'key',
        label: t('dashboard.reports.daily.columns.cadastralKey'),
        isDefault: true
      },
      {
        id: 'client',
        label: t('dashboard.reports.daily.columns.client'),
        isDefault: true
      },
      {
        id: 'value',
        label: t('dashboard.reports.daily.columns.value'),
        isDefault: true
      },
      {
        id: 'consumption',
        label: t('dashboard.reports.daily.columns.consumption'),
        isDefault: true
      },
      {
        id: 'type',
        label: t('dashboard.reports.daily.columns.type'),
        isDefault: true
      },
      {
        id: 'status',
        label: t('dashboard.reports.daily.columns.status'),
        isDefault: true
      },
      {
        id: 'novelty',
        label: t('dashboard.reports.daily.columns.novelty', 'Novedad'),
        isDefault: true
      }
    ],
    [t]
  );

  const pickerRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<DailyReadingsReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [resultSearchTerm, setResultSearchTerm] = useState('');

  const repository = useMemo(() => new HttpReportDashboardRepository(), []);
  const exportService = useMemo(() => new ExportService(), []);

  const useCase = useMemo(
    () => new GetDailyReadingsReportUseCase(repository),
    [repository]
  );

  const handleSearch = useCallback(
    async (searchDate?: string) => {
      const finalDate = searchDate || date;
      if (!finalDate) return;

      setLoading(true);
      setData([]); // Reset data to avoid stale view during loading
      setHasSearched(false);

      try {
        const result = await useCase.execute(finalDate);
        setData(result || []);
        setHasSearched(true);
      } catch (error) {
        console.error('Error fetching daily report', error);
      } finally {
        setLoading(false);
      }
    },
    [date, useCase]
  );

  useEffect(() => {
    if (date) {
      handleSearch(date);
    }
  }, [date, handleSearch]);

  const filteredData = useMemo(() => {
    if (!resultSearchTerm) return data;
    const lowerTerm = resultSearchTerm.toLowerCase();
    return data.filter(
      (row) =>
        (row.clientName || '').toLowerCase().includes(lowerTerm) ||
        (row.cadastralKey || '').toLowerCase().includes(lowerTerm) ||
        row.readingValue.toString().includes(resultSearchTerm)
    );
  }, [data, resultSearchTerm]);

  const mapRowData = useCallback(
    (d: DailyReadingsReport, selectedCols: ExportColumn[]) => {
      const rowData: Record<string, string> = {
        time: d.readingTime || '-',
        key: d.cadastralKey || '-',
        client: d.clientName || '-',
        value: `$ ${d.readingValue}`,
        consumption: `${d.consumption} m³`,
        type: d.measureType || '-',
        status: d.status || '-',
        novelty: d.novelty || '-'
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
        columnId: 'time'
      },
      {
        label: t('dashboard.reports.daily.columns.value', 'Valor'),
        value: `$ ${Number(totals.value).toFixed(2)}`,
        highlight: false,
        columnId: 'value'
      },
      {
        label: t('dashboard.reports.daily.columns.consumption', 'Consumo'),
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
      fileName: `reporte_diario_${date}`,
      title: t('dashboard.reports.daily.title', 'REPORTE DIARIO DE LECTURAS'),
      totals: totalsData
    });
  }, [
    availableColumns,
    filteredData,
    mapRowData,
    totalRows,
    exportService,
    date,
    t
  ]);

  const { setShowPdfPreview, PdfPreviewModal } = useTablePdfExport({
    data: filteredData,
    availableColumns,
    reportTitle: t(
      'dashboard.reports.daily.title',
      'REPORTE DIARIO DE LECTURAS'
    ),
    reportDescription: t(
      'dashboard.reports.daily.description',
      'Detalle de lecturas correspondientes al día seleccionado'
    ),
    labelsHorizontal: {
      [t('common.date', 'Fecha')]: date,
      [t('common.exportDate', 'Fecha de Exportación')]:
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    },
    totalRows,
    mapRowData
  });

  const columns = useMemo<Column<DailyReadingsReport>[]>(
    () => [
      {
        header: t('dashboard.reports.daily.columns.time'),
        accessor: 'readingTime'
      },
      {
        header: t('dashboard.reports.daily.columns.cadastralKey'),
        accessor: 'cadastralKey',
        style: { fontFamily: 'monospace' }
      },
      {
        header: t('dashboard.reports.daily.columns.client'),
        accessor: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar name={row.clientName} size="sm" />
            <div>
              <div style={{ fontWeight: 300 }}>
                {truncateText(row.clientName, 20)}
              </div>
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
        header: t(
          'dashboard.reports.daily.columns.averageConsumption',
          'Promedio de Consumo'
        ),
        accessor: (row) => `${row.averageConsumption} m³`
      },
      {
        header: t(
          'dashboard.reports.daily.columns.previewReading',
          'Lectura Previa'
        ),
        accessor: 'previewReading'
      },
      {
        header: t(
          'dashboard.reports.daily.columns.currentReading',
          'Lectura Actual'
        ),
        accessor: 'currentReading'
      },
      {
        header: t('dashboard.reports.daily.columns.value', 'Valor'),
        accessor: (row) => `$ ${row.readingValue}`,
        id: 'value',
        isNumeric: true
      },
      {
        header: t('dashboard.reports.daily.columns.consumption', 'Consumo'),
        accessor: (row) => `${row.consumption} m³`,
        id: 'consumption',
        isNumeric: true
      },
      {
        header: t('dashboard.reports.daily.columns.novelty', 'Novedad'),
        accessor: (row) => {
          const color = getNoveltyColor(row.novelty);
          return (
            <ColorChip
              color={color}
              label={row.novelty}
              size="sm"
              variant="soft"
            />
          );
        }
      }
    ],
    [t]
  );

  return (
    <div className="daily-report-container">
      {showToolbar && (
        <div className="daily-report-toolbar">
          <div className="daily-toolbar-side">
            <label className="toolbar-label-compact">Periodo</label>
            <DatePicker
              view="date"
              value={date}
              onChange={(value) => setDate(value)}
              disabled={loading}
              ref={pickerRef}
              size="compact"
            />
            <Button
              onClick={() => handleSearch()}
              isLoading={loading}
              leftIcon={<Search size={14} />}
              size="sm"
              color="primary"
            >
              Load
            </Button>

            {data.length > 0 && (
              <div className="filter-search-wrapper">
                <Search size={12} />
                <input
                  type="text"
                  className="toolbar-input-compact"
                  placeholder="Filter records..."
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
          pageSize={10}
          emptyState={
            hasSearched ? (
              <EmptyState
                message="No readings found"
                description={`No readings found for ${date}`}
                icon={IoInformationCircleOutline}
                variant="info"
              />
            ) : (
              <EmptyState
                message="Select a date to view readings"
                description="Select a date to view readings"
                icon={IoInformationCircleOutline}
                variant="info"
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
