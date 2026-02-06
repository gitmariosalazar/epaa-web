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
        pdfGenerator={(orientation) => {
          const rows = filteredData.map((d) => [
            d.readingTime ? new Date(d.readingTime).toLocaleString() : '-',
            d.cadastralKey,
            d.blockNumber || '',
            d.clientName,
            d.readingValue.toString(),
            d.measureType || '',
            d.status || '',
            `${d.observation || '-'}`
          ]);
          return exportService.generatePdfBlobUrl({
            rows,
            columns: [
              'Date/Time',
              'Key',
              'Block',
              'Client',
              'Value',
              'Type',
              'Status',
              'Obs'
            ],
            fileName: 'daily_report',
            title: 'Daily Readings Report',
            orientation
          });
        }}
        onDownload={(orientation) => {
          const rows = filteredData.map((d) => [
            d.readingTime ? new Date(d.readingTime).toLocaleString() : '-',
            d.cadastralKey,
            d.blockNumber || '',
            d.clientName,
            d.readingValue.toString(),
            d.measureType || '',
            d.status || '',
            `${d.observation || '-'}`
          ]);
          exportService.exportToPdf({
            rows,
            columns: [
              'Date/Time',
              'Key',
              'Block',
              'Client',
              'Value',
              'Type',
              'Status',
              'Obs'
            ],
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
