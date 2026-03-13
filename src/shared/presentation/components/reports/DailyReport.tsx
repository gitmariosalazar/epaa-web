import { useState, useMemo, useEffect, useRef } from 'react';
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
import { ReportPreviewModal } from './ReportPreviewModal';
import type { ExportColumn } from './ReportPreviewModal';
import { Avatar } from '../Avatar/Avatar';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '../DatePicker/DatePicker';
import './DailyReport.css';
import { Button } from '../Button/Button';

export const DailyReport = () => {
  const { t } = useTranslation();

  const AVAILABLE_COLUMNS: ExportColumn[] = useMemo(
    () => [
      {
        id: 'time',
        label: t('dashboard.reports.daily.columns.dateTime'),
        isDefault: true
      },
      {
        id: 'key',
        label: t('dashboard.reports.daily.columns.cadastralKey'),
        isDefault: true
      },
      {
        id: 'block',
        label: t('dashboard.reports.daily.columns.block'),
        isDefault: true
      },
      {
        id: 'client',
        label: t('dashboard.reports.daily.columns.client'),
        isDefault: true
      },
      {
        id: 'average',
        label: t('dashboard.reports.daily.columns.average'),
        isDefault: false
      },
      {
        id: 'preview',
        label: t('dashboard.reports.daily.columns.preview'),
        isDefault: false
      },
      {
        id: 'current',
        label: t('dashboard.reports.daily.columns.current'),
        isDefault: false
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
        id: 'obs',
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
  const [showPdfPreview, setShowPdfPreview] = useState(false);

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
    []
  );

  return (
    <div className="daily-report-container">
      <div className="daily-report-toolbar">
        {/* Unified Search Row */}
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

        {data.length > 0 && (
          <div className="daily-toolbar-side actions">
            <Button
              variant="outline"
              color="red"
              size="sm"
              iconOnly
              leftIcon={ColoredIcons.Pdf}
              onClick={() => setShowPdfPreview(true)}
              title="Export PDF"
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
              title="Export Excel"
            />
          </div>
        )}
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
      <ReportPreviewModal
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        dataCount={filteredData.length}
        reportTitle="Daily Readings Report"
        availableColumns={AVAILABLE_COLUMNS}
        pdfGenerator={(options) => {
          const { orientation, selectedColumnIds } = options;

          // Filter columns based on selection
          const selectedCols = AVAILABLE_COLUMNS.filter((col) =>
            selectedColumnIds.includes(col.id)
          );
          const colLabels = selectedCols.map((c) => c.label);

          const rows = filteredData.map((d) => {
            const rowData: any = {};
            rowData['time'] = d.readingTime
              ? dateService.formatToLocaleString(d.readingTime, {
                  dateStyle: 'short',
                  timeStyle: 'medium'
                })
              : '-';
            rowData['key'] = d.cadastralKey;
            rowData['block'] = d.blockNumber || '';
            rowData['client'] = d.clientName;
            rowData['average'] = `${d.averageConsumption} m³`;
            rowData['preview'] = d.previewReading;
            rowData['current'] = d.currentReading;
            rowData['value'] = d.readingValue.toString();
            rowData['consumption'] = `${d.consumption} m³`;
            rowData['type'] = d.measureType || '';
            rowData['status'] = d.status || '';
            rowData['obs'] = `${d.observation || '-'}`;

            // Map to array in correct order
            return selectedCols.map((col) => rowData[col.id]);
          });

          return exportService.generatePdfBlobUrl({
            rows,
            columns: colLabels,
            fileName: 'daily_report',
            title: 'Daily Readings Report',
            orientation
          });
        }}
        onDownload={(options) => {
          const { orientation, selectedColumnIds } = options;

          const selectedCols = AVAILABLE_COLUMNS.filter((col) =>
            selectedColumnIds.includes(col.id)
          );
          const colLabels = selectedCols.map((c) => c.label);

          const rows = filteredData.map((d) => {
            const rowData: any = {};
            rowData['time'] = d.readingTime
              ? dateService.formatToLocaleString(d.readingTime, {
                  dateStyle: 'short',
                  timeStyle: 'medium'
                })
              : '-';
            rowData['key'] = d.cadastralKey;
            rowData['block'] = d.blockNumber || '';
            rowData['client'] = d.clientName;
            rowData['average'] = `${d.averageConsumption} m³`;
            rowData['preview'] = d.previewReading;
            rowData['current'] = d.currentReading;
            rowData['value'] = d.readingValue.toString();
            rowData['consumption'] = `${d.consumption} m³`;
            rowData['type'] = d.measureType || '';
            rowData['status'] = d.status || '';
            rowData['obs'] = `${d.observation || '-'}`;

            return selectedCols.map((col) => rowData[col.id]);
          });

          exportService.exportToPdf({
            rows,
            columns: colLabels,
            fileName: 'daily_report',
            title: 'Daily Readings Report',
            orientation
          });
          setShowPdfPreview(false);
        }}
      />
    </div>
  );
};
