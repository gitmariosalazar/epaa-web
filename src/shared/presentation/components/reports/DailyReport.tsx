import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Table, type Column } from '../Table/Table';
import type { DailyReadingsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { GetDailyReadingsReportUseCase } from '@/modules/dashboard/application/usecases/get-daily-readings-report.usecase';
import { HttpReportDashboardRepository } from '@/modules/dashboard/infrastructure/repositories/http-report-dashboard.repository';
import { ColoredIcons } from '../../utils/icons/CustomIcons';
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

export const DailyReport = () => {
  const { t } = useTranslation();

  const AVAILABLE_COLUMNS: ExportColumn[] = useMemo(
    () => [
      {
        columnId: 'time',
        id: 'time',
        label: t('dashboard.reports.daily.columns.dateTime'),
        isDefault: true
      },
      {
        columnId: 'key',
        id: 'key',
        label: t('dashboard.reports.daily.columns.cadastralKey'),
        isDefault: true
      },
      {
        columnId: 'block',
        id: 'block',
        label: t('dashboard.reports.daily.columns.block'),
        isDefault: true
      },
      {
        columnId: 'client',
        id: 'client',
        label: t('dashboard.reports.daily.columns.client'),
        isDefault: true
      },
      {
        columnId: 'average',
        id: 'average',
        label: t('dashboard.reports.daily.columns.average'),
        isDefault: false
      },
      {
        columnId: 'preview',
        id: 'preview',
        label: t('dashboard.reports.daily.columns.preview'),
        isDefault: false
      },
      {
        columnId: 'current',
        id: 'current',
        label: t('dashboard.reports.daily.columns.current'),
        isDefault: false
      },
      {
        columnId: 'value',
        id: 'value',
        label: t('dashboard.reports.daily.columns.value'),
        isDefault: true
      },
      {
        columnId: 'consumption',
        id: 'consumption',
        label: t('dashboard.reports.daily.columns.consumption'),
        isDefault: true
      },
      {
        columnId: 'type',
        id: 'type',
        label: t('dashboard.reports.daily.columns.type'),
        isDefault: true
      },
      {
        columnId: 'status',
        id: 'status',
        label: t('dashboard.reports.daily.columns.status'),
        isDefault: true
      },
      {
        columnId: 'observation',
        id: 'observation',
        label: t('dashboard.reports.daily.columns.observation'),
        isDefault: true
      }
    ],
    [t]
  );

  const pickerRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState<string>(dateService.getCurrentDateString());
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

  const handleSearch = async () => {
    if (!date) return;
    setLoading(true);
    try {
      const result = await useCase.execute(date);
      setData(result);
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching daily report', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

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
      try {
        const rowData: Record<string, string> = {};
        // Se combina la fecha del reporte con el tiempo de lectura si solo viene el tiempo HH:MM:SS
        const fullDateStr = d.readingTime && !d.readingTime.includes('-')
          ? `${date}T${d.readingTime}`
          : d.readingTime;

        rowData['time'] = fullDateStr
          ? dateService.formatToLocaleString(fullDateStr, {
              dateStyle: 'short',
              timeStyle: 'medium'
            })
          : '-';
        rowData['key'] = d.cadastralKey;
        rowData['block'] = d.blockNumber || '';
        rowData['client'] = d.clientName;
        rowData['average'] = `${d.averageConsumption} m³`;
        rowData['preview'] = d.previewReading?.toString() || '0';
        rowData['current'] = d.currentReading?.toString() || '0';
        rowData['value'] = d.readingValue.toString();
        rowData['consumption'] = `${d.consumption} m³`;
        rowData['type'] = d.measureType || '';
        rowData['status'] = d.status || '';
        rowData['observation'] = `${d.observation || '-'}`;

        return selectedCols.map((col) => {
          const key = (col.columnId || col.id) as keyof typeof rowData;
          return rowData[key] || '-';
        });
      } catch (error) {
        console.error('Error mapping daily row data:', error);
        return selectedCols.map(() => '-');
      }
    },
    [date]
  );

  const {
    setShowPdfPreview,
    PdfPreviewModal
  } = useTablePdfExport({
    data: filteredData,
    availableColumns: AVAILABLE_COLUMNS,
    reportTitle: t('dashboard.reports.daily.title', 'REPORTE DIARIO DE LECTURAS'),
    reportDescription: t('dashboard.reports.daily.description', 'Detalle de lecturas correspondientes al día seleccionado'),
    labelsHorizontal: {
      [t('common.date', 'Fecha')]: date,
      [t('common.exportDate', 'Fecha de Exportación')]: 
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    },
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
        header: 'Average Consumption',
        accessor: (row) => `${row.averageConsumption} m³`
      },
      {
        header: 'Preview Reading',
        accessor: 'previewReading'
      },
      {
        header: 'Current Reading',
        accessor: 'currentReading'
      },
      {
        header: 'Reading Value',
        accessor: (row) => `$ ${row.readingValue}`
      },
      {
        header: 'Consumption',
        accessor: (row) => `${row.consumption} m³`
      },
      {
        header: 'Novelty',
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
      <div className="daily-report-toolbar">
        <div className="daily-toolbar-side">
          <label className="toolbar-label-compact">Period</label>
          <DatePicker
            view="date"
            value={date}
            onChange={(value) => setDate(value)}
            disabled={loading}
            ref={pickerRef}
          />
          <Button
            onClick={handleSearch}
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

        <div className="daily-toolbar-side actions">
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
              exportService.exportToExcel(filteredData, 'daily_report');
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
              message="No readings found"
              description={`No readings found for ${date}`}
            />
          ) : (
            <EmptyState
              message="Select a date to view readings"
              description="Select a date to view readings"
            />
          )
        }
      />
      {PdfPreviewModal}
    </div>
  );
};
