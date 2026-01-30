import { GetAdvancedReportReadingsUseCase } from '@/modules/dashboard/application/usecases/get-advanced-report-readings.usecase';
import type { AdvancedReportReadings } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { HttpReportDashboardRepository } from '@/modules/dashboard/infrastructure/repositories/http-report-dashboard.repository';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { Calendar, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ColoredIcons } from '../../utils/icons/CustomIcons';
import { ColorChip } from '../chip/ColorChip';
import { EmptyState } from '../common/EmptyState';

export const AdvancedReadingsReport = () => {
  const pickerRef = useRef<HTMLInputElement>(null);
  const [month, setMonth] = useState<string>('2025-12');

  const [data, setData] = useState<AdvancedReportReadings[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [resultSearchTerm, setResultSearchTerm] = useState('');

  const repository = useMemo(() => new HttpReportDashboardRepository(), []);
  const exportService = useMemo(() => new ExportService(), []);
  const useCase = useMemo(
    () => new GetAdvancedReportReadingsUseCase(repository),
    [repository]
  );

  const handleSearch = async () => {
    if (!month) return;
    setLoading(true);
    try {
      const result = await useCase.execute(month);
      setData(result);
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching advanced readings report', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [month]);

  const filteredData = useMemo(() => {
    if (!resultSearchTerm) return data;
    return data.filter((item) =>
      item.sector.toString().includes(resultSearchTerm)
    );
  }, [data, resultSearchTerm]);

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
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
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
                  placeholder="Search sector..."
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
                    const rows = filteredData.map((d) => [
                      d.sector.toString(),
                      d.totalConnections.toString(),
                      d.readingsCompleted.toString(),
                      d.missingReadings.toString(),
                      d.progressPercentage.toString()
                    ]);
                    exportService.exportToPdf({
                      rows,
                      columns: [
                        'Sector',
                        'Total Connections',
                        'Readings Completed',
                        'Missing Readings',
                        'Progress Percentage'
                      ],
                      fileName: 'advanced_readings_report',
                      title: 'Advanced Readings Report'
                    });
                  }}
                >
                  {ColoredIcons.Pdf}
                  <span className="btn-text">PDF</span>
                </button>
                <button
                  className="btn-icon-text"
                  onClick={() => {
                    exportService.exportToExcel(
                      filteredData,
                      'advanced_readings_report'
                    );
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
              <th>Sector</th>
              <th>Total Connections</th>
              <th>Readings Completed</th>
              <th>Missing Readings</th>
              <th>Progress Percentage</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.sector}>
                  <td>{row.sector}</td>
                  <td style={{ fontFamily: 'monospace' }}>
                    {row.totalConnections}
                  </td>
                  <td>{row.readingsCompleted}</td>
                  <td>{row.missingReadings}</td>
                  <td>
                    <ColorChip
                      color={
                        row.progressPercentage >= 95
                          ? 'var(--success)'
                          : row.progressPercentage < 95 &&
                              row.progressPercentage > 50
                            ? 'var(--warning)'
                            : 'var(--error)'
                      }
                      label={`${row.progressPercentage}%`}
                      size="sm"
                      variant="soft"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="empty-state">
                  {hasSearched ? (
                    <EmptyState
                      message="No readings for this month"
                      description={`No readings found for ${month}`}
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
