import { useState, useMemo, useEffect, useRef } from 'react';
import { Calendar, Search } from 'lucide-react';
import type { DailyReadingsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { GetDailyReadingsReportUseCase } from '@/modules/dashboard/application/usecases/get-daily-readings-report.usecase';
import { HttpReportDashboardRepository } from '@/modules/dashboard/infrastructure/repositories/http-report-dashboard.repository';
import { ColoredIcons } from '../../utils/icons/CustomIcons';
import { ColorChip } from '../chip/ColorChip';
import { EmptyState } from '../common/EmptyState';
import { getNoveltyColor } from '../../utils/colors/novelties.colors';

export const DailyReport = () => {
  const pickerRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
    //'2025-01-27'
  );
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
                  onClick={() => {
                    const filtered = data.filter(
                      (row) =>
                        (row.clientName || '')
                          .toLowerCase()
                          .includes(resultSearchTerm.toLowerCase()) ||
                        (row.cadastralKey || '')
                          .toLowerCase()
                          .includes(resultSearchTerm.toLowerCase()) ||
                        row.readingValue.toString().includes(resultSearchTerm)
                    );
                    const rows = filtered.map((d) => [
                      new Date(d.readingTime).toLocaleString(),
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
                      title: 'Daily Readings Report'
                    });
                  }}
                >
                  {ColoredIcons.Pdf}
                  <span className="btn-text">PDF</span>
                </button>
                <button
                  className="btn-icon-text"
                  onClick={() => {
                    const filtered = data.filter(
                      (row) =>
                        (row.clientName || '')
                          .toLowerCase()
                          .includes(resultSearchTerm.toLowerCase()) ||
                        (row.cadastralKey || '')
                          .toLowerCase()
                          .includes(resultSearchTerm.toLowerCase()) ||
                        row.readingValue.toString().includes(resultSearchTerm)
                    );
                    exportService.exportToExcel(filtered, 'daily_report');
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

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Cadastral Key</th>
              <th>Client</th>
              <th>Average Consumption</th>
              <th>Preview Reading</th>
              <th>Current Reading</th>
              <th>Reading Value</th>
              <th>Consumption</th>
              <th>Novelty</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data
                .filter(
                  (row) =>
                    (row.clientName || '')
                      .toLowerCase()
                      .includes(resultSearchTerm.toLowerCase()) ||
                    (row.cadastralKey || '')
                      .toLowerCase()
                      .includes(resultSearchTerm.toLowerCase()) ||
                    row.readingValue.toString().includes(resultSearchTerm)
                )
                .map((row) => {
                  const color = getNoveltyColor(row.novelty);
                  return (
                    <tr key={row.readingId}>
                      <td>{row.readingTime}</td>
                      <td style={{ fontFamily: 'monospace' }}>
                        {row.cadastralKey}
                      </td>
                      <td>{row.clientName}</td>
                      <td>{row.averageConsumption} m³</td>
                      <td>{row.previewReading}</td>
                      <td>{row.currentReading}</td>
                      <td>$ {row.readingValue}</td>
                      <td>{row.consumption} m³</td>
                      <td>
                        <ColorChip
                          color={color}
                          label={row.novelty}
                          size="sm"
                          variant="soft"
                        />
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td colSpan={6} className="empty-state">
                  {hasSearched ? (
                    <EmptyState
                      message="No readings found"
                      description={`No readings found for ${date}`}
                    />
                  ) : (
                    <EmptyState
                      message="Select a date to view readings"
                      description="Select a date to view readings"
                    />
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
