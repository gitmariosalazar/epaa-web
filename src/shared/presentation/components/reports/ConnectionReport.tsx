import { useState, useMemo, useEffect } from 'react';
import type { ConnectionLastReadingsReport } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { GetConnectionLastReadingsReportUseCase } from '@/modules/dashboard/application/usecases/get-connection-last-readings-report.usecase';
import { HttpReportDashboardRepository } from '@/modules/dashboard/infrastructure/repositories/http-report-dashboard.repository';
import { Search } from 'lucide-react';
import { ColoredIcons } from '../../utils/icons/CustomIcons';
import { ColorChip } from '../chip/ColorChip';
import { EmptyState } from '../common/EmptyState';
import { Table, type Column } from '../Table/Table';

export const ConnectionReport = () => {
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

  const filteredData = useMemo(() => {
    if (!resultSearchTerm) return data;
    const lowerTerm = resultSearchTerm.toLowerCase();
    return data.filter(
      (row) =>
        (row.clientName || '').toLowerCase().includes(lowerTerm) ||
        (row.meterNumber || '').toLowerCase().includes(lowerTerm) ||
        new Date(row.readingDate)
          .toLocaleDateString()
          .includes(resultSearchTerm)
    );
  }, [data, resultSearchTerm]);

  const columns = useMemo<Column<ConnectionLastReadingsReport>[]>(
    () => [
      {
        header: 'Date',
        accessor: (row) => new Date(row.readingDate).toLocaleDateString()
      },
      {
        header: 'Reading Value',
        accessor: 'readingValue',
        className: 'font-medium'
      },
      {
        header: 'Consumption',
        accessor: (row) => `${row.consumption} m³`
      },
      {
        header: 'Client',
        accessor: (row) => (
          <div>
            <div>{row.clientName}</div>
            <small style={{ color: '#9ca3af' }}>{row.address}</small>
          </div>
        )
      },
      {
        header: 'Meter',
        accessor: 'meterNumber'
      },
      {
        header: 'Status',
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
    <div>
      <div className="reports-toolbar">
        {/* Top Row: Primary Search */}
        <div className="toolbar-row">
          <div className="toolbar-group main">
            <label className="toolbar-label">
              Cadastral Key / Connection ID
            </label>
            <div className="toolbar-controls">
              <input
                type="text"
                className="toolbar-input input-cadastral"
                placeholder="e.g. 1-2-3-4"
                maxLength={15}
                value={cadastralKey}
                onChange={(e) => setCadastralKey(e.target.value)}
              />
            </div>
          </div>
          <div className="toolbar-group actions">
            <label className="toolbar-label">&nbsp;</label>{' '}
            {/* Spacer for alignment */}
            <div className="toolbar-controls">
              <select
                className="toolbar-select"
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
              <button
                className="btn-search"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  'Searching...'
                ) : (
                  <>
                    <Search size={18} />{' '}
                    <span className="btn-text">Search</span>
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
              <label className="toolbar-label">Filter History</label>
              <div className="input-icon-wrapper">
                <Search size={18} />
                <input
                  type="text"
                  className="toolbar-input input-search"
                  placeholder="Search date, client, or values..."
                  maxLength={60}
                  value={resultSearchTerm}
                  onChange={(e) => setResultSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="toolbar-group actions">
              <label className="toolbar-label" style={{ visibility: 'hidden' }}>
                Export
              </label>{' '}
              {/* Spacer label */}
              <div className="toolbar-controls">
                <button
                  className="btn-icon-text"
                  onClick={() => {
                    const rows = filteredData.map((d) => [
                      new Date(d.readingDate).toLocaleDateString(),
                      d.readingValue.toString(),
                      `${d.consumption} m³`,
                      d.clientName,
                      d.meterNumber,
                      d.novelty
                    ]);
                    exportService.exportToPdf({
                      rows,
                      columns: [
                        'Date',
                        'Reading',
                        'Consumption',
                        'Client',
                        'Meter',
                        'Status'
                      ],
                      fileName: 'connection_history',
                      title: 'Connection Reading History',
                      clientInfo:
                        filteredData.length > 0
                          ? {
                              'Client Name': filteredData[0].clientName || '',
                              'Cadastral Key':
                                filteredData[0].cadastralKey || '',
                              'Meter Number': filteredData[0].meterNumber || '',
                              Address: filteredData[0].address || ''
                            }
                          : undefined
                    });
                  }}
                >
                  {ColoredIcons.Pdf}
                  <span className="btn-text">Export PDF</span>
                </button>
                <button
                  className="btn-icon-text"
                  onClick={() => {
                    exportService.exportToExcel(
                      filteredData,
                      'connection_history'
                    );
                  }}
                >
                  {ColoredIcons.Excel}
                  <span className="btn-text">Export Excel</span>
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
    </div>
  );
};
