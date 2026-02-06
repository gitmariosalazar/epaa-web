import { useState, useMemo, useEffect, useRef } from 'react';
import { Calendar, Search } from 'lucide-react';
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

const AVAILABLE_COLUMNS: ExportColumn[] = [
  { id: 'time', label: 'Date/Time', isDefault: true },
  { id: 'key', label: 'Cadastral Key', isDefault: true },
  { id: 'block', label: 'Block', isDefault: true },
  { id: 'client', label: 'Client', isDefault: true },
  { id: 'average', label: 'Average Consumption', isDefault: false },
  { id: 'preview', label: 'Preview Reading', isDefault: false },
  { id: 'current', label: 'Current Reading', isDefault: false },
  { id: 'value', label: 'Reading Value', isDefault: true },
  { id: 'consumption', label: 'Consumption', isDefault: true },
  { id: 'type', label: 'Measure Type', isDefault: true },
  { id: 'status', label: 'Status', isDefault: true },
  { id: 'obs', label: 'Observation', isDefault: true }
];

export const DailyReport = () => {
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
        header: 'Time',
        accessor: 'readingTime'
      },
      {
        header: 'Cadastral Key',
        accessor: 'cadastralKey',
        style: { fontFamily: 'monospace' }
      },
      {
        header: 'Client',
        accessor: 'clientName'
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
    <div>
      <div className="reports-toolbar">
        {/* Top Row: Date Selection */}
        <div className="toolbar-row">
          <div className="toolbar-group main">
            <label className="toolbar-label">Select Date</label>
            <div className="toolbar-controls">
              <div
                className="dashboard-controls"
                onClick={() => pickerRef.current?.showPicker()}
                title="Change Period"
              >
                <Calendar className="text-gray-400" size={20} color="#9ca3af" />
                <input
                  ref={pickerRef}
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="month-picker"
                />
              </div>
            </div>
          </div>
          <div className="toolbar-group actions">
            <label className="toolbar-label">&nbsp;</label>
            <div className="toolbar-controls">
              <button
                className="btn-search"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  'Loading...'
                ) : (
                  <>
                    <Search size={18} />{' '}
                    <span className="btn-text">Load Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Filtering and Actions */}
        {data.length > 0 && (
          <div className="toolbar-row">
            <div className="toolbar-group main">
              <label className="toolbar-label">Filter Results</label>
              <div className="input-icon-wrapper">
                <Search size={18} />
                <input
                  type="text"
                  className="toolbar-input input-search"
                  placeholder="Search client, key, or reading..."
                  maxLength={60}
                  value={resultSearchTerm}
                  onChange={(e) => setResultSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="toolbar-group actions">
              <label className="toolbar-label" style={{ visibility: 'hidden' }}>
                Export
              </label>
              <div className="toolbar-controls">
                <button
                  className="btn-icon-text"
                  onClick={() => setShowPdfPreview(true)}
                >
                  {ColoredIcons.Pdf}
                  <span className="btn-text">PDF</span>
                </button>
                <button
                  className="btn-icon-text"
                  onClick={() => {
                    exportService.exportToExcel(filteredData, 'daily_report');
                  }}
                >
                  {ColoredIcons.Excel}
                  <span className="btn-text">Excel</span>
                </button>
              </div>
            </div>
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
              ? new Date(d.readingTime).toLocaleString()
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
              ? new Date(d.readingTime).toLocaleString()
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
