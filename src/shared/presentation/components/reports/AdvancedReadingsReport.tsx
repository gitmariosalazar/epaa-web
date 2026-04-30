import { GetAdvancedReportReadingsUseCase } from '@/modules/dashboard/application/usecases/get-advanced-report-readings.usecase';
import type { AdvancedReportReadings } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { HttpReportDashboardRepository } from '@/modules/dashboard/infrastructure/repositories/http-report-dashboard.repository';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { List, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { EmptyState } from '../common/EmptyState';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { getTrafficLightColor } from '../../utils/colors/traffic-lights.colors';
import { ProgressBar } from '../ProgressBar/ProgressBar';
import { Table, type Column } from '../Table/Table';
import { Button } from '../Button/Button';
import { SectorReadingsModal } from '../dashboard/SectorReadingsModal';
import { DatePicker } from '../DatePicker/DatePicker';
import { useTranslation } from 'react-i18next';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import type { ExportColumn } from './ReportPreviewModal';
import { useCallback } from 'react';
import './AdvancedReadingsReport.css';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { Tooltip } from '../common/Tooltip/Tooltip';

interface AdvancedReadingsReportProps {
  showToolbar?: boolean;
  showTable?: boolean;
  externalMonth?: string;
  onMonthChange?: (month: string) => void;
}

export const AdvancedReadingsReport: React.FC<AdvancedReadingsReportProps> = ({
  showToolbar = true,
  showTable = true,
  externalMonth,
  onMonthChange
}) => {
  const { t } = useTranslation();
  const pickerRef = useRef<HTMLInputElement>(null);

  const [monthInternal, setMonthInternal] = useState<string>(
    dateService.getCurrentMonthString()
  );

  const month = externalMonth ?? monthInternal;
  const setMonth = onMonthChange ?? setMonthInternal;

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<
    'completed' | 'missing' | null
  >(null);

  const openModal = (sector: number, type: 'completed' | 'missing') => {
    setSelectedSector(sector);
    setSelectedType(type);
    setIsModalOpen(true);
  };

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

  const availableColumns: ExportColumn[] = [
    {
      id: 'sector',
      label: t('dashboard.reports.advanced.columns.sector', 'Sector')
    },
    {
      id: 'totalConnections',
      label: t(
        'dashboard.reports.advanced.columns.totalConnections',
        'Total de Acometidas'
      )
    },
    {
      id: 'readingsCompleted',
      label: t(
        'dashboard.reports.advanced.columns.readingsCompleted',
        'Lecturas Completadas'
      )
    },
    {
      id: 'missingReadings',
      label: t(
        'dashboard.reports.advanced.columns.missingReadings',
        'Lecturas Faltantes'
      )
    },
    {
      id: 'progressPercentage',
      label: t('dashboard.reports.advanced.columns.progress', 'Progreso %')
    }
  ];

  const filteredData = useMemo(() => {
    if (!resultSearchTerm) return data;
    return data.filter((item) =>
      item.sector.toString().includes(resultSearchTerm)
    );
  }, [data, resultSearchTerm]);

  const mapRowData = useCallback(
    (row: AdvancedReportReadings, selectedCols: ExportColumn[]) => {
      const rowData: Record<string, string> = {
        sector: (row.sector ?? '').toString(),
        totalConnections: (row.totalConnections ?? 0).toString(),
        readingsCompleted: (row.readingsCompleted ?? 0).toString(),
        missingReadings: (row.missingReadings ?? 0).toString(),
        progressPercentage: `${Number(row.progressPercentage ?? 0).toFixed(1)}%`
      };

      return selectedCols.map((col) => rowData[col.id] || '-');
    },
    []
  );

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        connections: acc.connections + Number(item.totalConnections || 0),
        completed: acc.completed + Number(item.readingsCompleted || 0),
        missing: acc.missing + Number(item.missingReadings || 0)
      }),
      { connections: 0, completed: 0, missing: 0 }
    );
  }, [filteredData]);

  const totalRows = useMemo(() => {
    const overallProgress =
      Number(totals.connections) > 0
        ? (Number(totals.completed) / Number(totals.connections)) * 100
        : 0;

    return [
      {
        label: t('common.totalRecords', 'Total sectores'),
        value: filteredData.length,
        columnId: 'sector'
      },
      {
        label: t(
          'dashboard.reports.advanced.columns.totalConnections',
          'Total'
        ),
        value: totals.connections,
        highlight: false,
        columnId: 'totalConnections'
      },
      {
        label: t(
          'dashboard.reports.advanced.columns.readingsCompleted',
          'Completas'
        ),
        value: totals.completed,
        highlight: false,
        columnId: 'readingsCompleted'
      },
      {
        label: t(
          'dashboard.reports.advanced.columns.missingReadings',
          'Faltantes'
        ),
        value: totals.missing,
        highlight: false,
        columnId: 'missingReadings'
      },
      {
        label: t('dashboard.reports.advanced.columns.progress', 'Progreso'),
        value: `${overallProgress.toFixed(1)}%`,
        highlight: false,
        columnId: 'progressPercentage'
      }
    ];
  }, [t, filteredData.length, totals]);

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
      fileName: `reporte_avanzado_${new Date().toLocaleDateString()}`,
      title: t(
        'dashboard.reports.advanced.title',
        'REPORTE AVANZADO DE LECTURAS'
      ),
      totals: totalsData
    });
  }, [availableColumns, filteredData, mapRowData, totalRows, exportService, t]);

  const { setShowPdfPreview, PdfPreviewModal } = useTablePdfExport({
    data: filteredData,
    availableColumns,
    reportTitle: t(
      'dashboard.reports.advanced.title',
      'REPORTE DE LECTURAS AVANZADAS'
    ),
    reportDescription: t(
      'dashboard.reports.advanced.description',
      'Detalle de avance de lecturas por sector'
    ),
    labelsHorizontal: {
      [t('common.period', 'Periodo')]: month,
      [t('common.exportDate', 'Fecha de Exportación')]:
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    },
    totalRows,
    mapRowData
  });

  /* Pagination logic handled by Table component */

  const columns = useMemo<Column<AdvancedReportReadings>[]>(
    () => [
      {
        header: t('common.sector', 'Sector'),
        accessor: 'sector'
      },
      {
        header: t('common.totalConnections', 'Total Acometidas'),
        accessor: 'totalConnections',
        id: 'totalConnections',
        isNumeric: true,
        style: { fontFamily: 'monospace' }
      },
      {
        header: t('common.readingsCompleted', 'Lecturas Completadas'),
        id: 'readingsCompleted',
        isNumeric: true,
        accessor: (row: AdvancedReportReadings) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '10px',
              paddingRight: '10px'
            }}
          >
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {row.readingsCompleted}
            </span>
            {row.readingsCompleted > 0 && (
              <Tooltip
                content={t('Ver Completadas')}
                position="bottom"
                themeColor="blue"
              >
                <Button
                  variant="outline"
                  size="xs"
                  color="slate"
                  iconOnly
                  leftIcon={<List size={14} />}
                  onClick={() => openModal(row.sector, 'completed')}
                  circle
                />
              </Tooltip>
            )}
          </div>
        )
      },
      {
        header: t('common.missingReadings', 'Lecturas Faltantes'),
        id: 'missingReadings',
        isNumeric: true,
        accessor: (row: AdvancedReportReadings) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '10px',
              paddingRight: '10px'
            }}
          >
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {row.missingReadings}
            </span>
            {row.missingReadings > 0 && (
              <Tooltip
                content={t('Ver Faltantes')}
                position="bottom"
                themeColor="sky"
              >
                <Button
                  variant="outline"
                  size="xs"
                  color="slate"
                  iconOnly
                  leftIcon={<List size={14} />}
                  onClick={() => openModal(row.sector, 'missing')}
                  circle
                />
              </Tooltip>
            )}
          </div>
        )
      },
      {
        header: t('dashboard.reports.advanced.columns.progress', 'Progreso'),
        id: 'progressPercentage',
        isNumeric: true,
        accessor: (row) => (
          <ProgressBar
            value={row.progressPercentage}
            color={getTrafficLightColor(row.progressPercentage)}
            height="8px"
          />
        )
      }
    ],
    []
  );

  return (
    <div className="advanced-report-container">
      {showToolbar && (
        <div className="advanced-report-toolbar">
          {/* Unified Search Row */}
          <div className="advanced-toolbar-side">
            <label className="toolbar-label-compact">Periodo</label>
            <DatePicker
              view="month"
              value={month}
              onChange={(value) => setMonth(value)}
              disabled={loading}
              ref={pickerRef}
              size="compact"
            />
            <Button
              onClick={handleSearch}
              isLoading={loading}
              leftIcon={<Search size={14} />}
              size="sm"
              color="primary"
            >
              Search
            </Button>

            <div className="filter-search-wrapper">
              <Search size={12} />
              <input
                type="text"
                className="toolbar-input-compact"
                placeholder="Filter sector..."
                maxLength={60}
                value={resultSearchTerm}
                onChange={(e) => setResultSearchTerm(e.target.value)}
              />
            </div>
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
                message="No readings for this month"
                description={`No readings found for ${month}`}
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
      <SectorReadingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sector={selectedSector}
        month={month}
        type={selectedType}
      />
    </div>
  );
};
