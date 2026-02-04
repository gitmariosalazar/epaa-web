import { useState, useMemo, useEffect } from 'react';
import type { YearlyReadingsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { GetYearlyReadingsReportUseCase } from '@/modules/dashboard/application/usecases/get-yearly-readings-report.usecase';
import { HttpReportDashboardRepository } from '@/modules/dashboard/infrastructure/repositories/http-report-dashboard.repository';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { Search, Droplets, FileText, Calendar } from 'lucide-react';
import { ColoredIcons } from '../../utils/icons/CustomIcons';
import { EmptyState } from '../common/EmptyState';
import { Table, type Column } from '../Table/Table';

export const YearlyReport = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<YearlyReadingsReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const repository = useMemo(() => new HttpReportDashboardRepository(), []);
  const useCase = useMemo(
    () => new GetYearlyReadingsReportUseCase(repository),
    [repository]
  );
  const exportService = useMemo(() => new ExportService(), []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const result = await useCase.execute(year);
      const actualResult = Array.isArray(result) ? result[0] : result;
      setData(actualResult);
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching yearly report', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleExportPdf = () => {
    if (!data || !data.monthlySummaries) return;

    const rows = data.monthlySummaries.map((m) => [
      m.month,
      m.totalReadings.toString(),
      `${Number(m.totalConsumption).toFixed(2)} m³`
    ]);

    exportService.exportToPdf({
      rows,
      columns: ['Month', 'Readings Count', 'Total Consumption'],
      fileName: `yearly_report_${year}`,
      title: `Yearly Report - ${year}`
    });
  };

  const handleExportExcel = () => {
    if (!data || !data.monthlySummaries) return;

    // Create a flat structure for Excel
    const excelData = data.monthlySummaries.map((m) => ({
      Month: m.month,
      'Readings Count': m.totalReadings,
      'Total Consumption': Number(m.totalConsumption)
    }));

    exportService.exportToExcel(excelData, `yearly_report_${year}`);
  };

  /* Define columns for the shared Table component */
  const columns = useMemo<Column<any>[]>(
    () => [
      {
        header: 'Month',
        accessor: 'month',
        className: 'font-medium'
      },
      {
        header: 'Readings Count',
        accessor: 'totalReadings'
      },
      {
        header: 'Total Consumption',
        accessor: (row) => `${Number(row.totalConsumption).toFixed(2)} m³`
      }
    ],
    []
  );

  return (
    <div>
      <style>{`
        @media (max-width: 895px) {
          .custom-hide-responsive {
            display: none !important;
          }
        }
      `}</style>
      <div className="reports-toolbar">
        <div className="toolbar-row">
          <div className="toolbar-group main">
            <label className="toolbar-label">Select Year</label>
            <div className="toolbar-controls">
              <input
                type="number"
                className="toolbar-input input-cadastral"
                style={{ width: '120px' }}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min="2000"
                max="2100"
              />
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
                    <span className="btn-text">Generate Report</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {data && (
            <div className="toolbar-group actions">
              <label className="toolbar-label" style={{ visibility: 'hidden' }}>
                Export
              </label>
              <div className="toolbar-controls">
                <button
                  className="btn-icon-text"
                  onClick={handleExportPdf}
                  title="Export to PDF"
                >
                  {ColoredIcons.Pdf}
                  <span className="btn-text custom-hide-responsive">
                    Export PDF
                  </span>
                </button>
                <button
                  className="btn-icon-text"
                  onClick={handleExportExcel}
                  title="Export to Excel"
                >
                  {ColoredIcons.Excel}
                  <span className="btn-text custom-hide-responsive">
                    Export Excel
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {data ? (
        <div className="report-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper icon-blue">
                <FileText size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-title">Total Readings</p>
                <h3>{data.totalReadings}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper icon-green">
                <Droplets size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-title">Avg Consumption</p>
                <h3>{Number(data.averageConsumption).toFixed(2)} m³</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper icon-purple">
                <Calendar size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-title">Year</p>
                <h3>{data.year}</h3>
              </div>
            </div>
          </div>

          <Table
            data={data.monthlySummaries}
            columns={columns}
            pagination={true}
            pageSize={15}
            emptyState={
              <EmptyState
                message="No data found"
                description={`No data found for ${year}`}
              />
            }
          />
        </div>
      ) : (
        <div className="empty-state">
          {hasSearched ? (
            <EmptyState
              message="No data found"
              description={`No data found for ${year}`}
            />
          ) : (
            <EmptyState
              message="Select a year"
              description="Select a year to view the summary."
            />
          )}
        </div>
      )}
    </div>
  );
};
