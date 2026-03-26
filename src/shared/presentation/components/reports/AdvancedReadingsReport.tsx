import { GetAdvancedReportReadingsUseCase } from '@/modules/dashboard/application/usecases/get-advanced-report-readings.usecase';
import type { AdvancedReportReadings } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { HttpReportDashboardRepository } from '@/modules/dashboard/infrastructure/repositories/http-report-dashboard.repository';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { List, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ColoredIcons } from '../../utils/icons/CustomIcons';
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

export const AdvancedReadingsReport = () => {
  const { t } = useTranslation();
  const pickerRef = useRef<HTMLInputElement>(null);
  const [month, setMonth] = useState<string>(
    dateService.getCurrentMonthString()
  );

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

  const AVAILABLE_COLUMNS: ExportColumn[] = useMemo(
    () => [
      { columnId: 'sector', id: 'sector', label: t('dashboard.reports.advanced.columns.sector', 'Sector'), isDefault: true },
      { columnId: 'totalConnections', id: 'totalConnections', label: t('dashboard.reports.advanced.columns.totalConnections', 'Total Connections'), isDefault: true },
      { columnId: 'readingsCompleted', id: 'readingsCompleted', label: t('dashboard.reports.advanced.columns.readingsCompleted', 'Readings Completed'), isDefault: true },
      { columnId: 'missingReadings', id: 'missingReadings', label: t('dashboard.reports.advanced.columns.missingReadings', 'Missing Readings'), isDefault: true },
      { columnId: 'progressPercentage', id: 'progressPercentage', label: t('dashboard.reports.advanced.columns.progress', 'Progress %'), isDefault: true }
    ],
    [t]
  );

  const mapRowData = useCallback(
    (row: AdvancedReportReadings, selectedCols: ExportColumn[]) => {
      try {
        const rowData: Record<string, string> = {
          sector: (row.sector ?? '').toString(),
          totalConnections: (row.totalConnections ?? 0).toString(),
          readingsCompleted: (row.readingsCompleted ?? 0).toString(),
          missingReadings: (row.missingReadings ?? 0).toString(),
          progressPercentage: `${(row.progressPercentage ?? 0).toFixed(1)}%`
        };

        return selectedCols.map((col) => {
          const key = (col.columnId || col.id) as keyof typeof rowData;
          return rowData[key] || '-';
        });
      } catch (error) {
        console.error('Error mapping row data:', error);
        return selectedCols.map(() => '-');
      }
    },
    []
  );

  const filteredData = useMemo(() => {
    if (!resultSearchTerm) return data;
    return data.filter((item) =>
      item.sector.toString().includes(resultSearchTerm)
    );
  }, [data, resultSearchTerm]);

  const {
    setShowPdfPreview,
    PdfPreviewModal
  } = useTablePdfExport({
    data: filteredData,
    availableColumns: AVAILABLE_COLUMNS,
    reportTitle: t('dashboard.reports.advanced.title', 'REPORTE DE LECTURAS AVANZADAS'),
    reportDescription: t('dashboard.reports.advanced.description', 'Detalle de avance de lecturas por sector'),
    labelsHorizontal: {
      [t('common.period', 'Periodo')]: month,
      [t('common.exportDate', 'Fecha de Exportación')]: 
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    },
    mapRowData
  });

  /* Pagination logic handled by Table component */

  const columns = useMemo<Column<AdvancedReportReadings>[]>(
    () => [
      {
        header: 'Sector',
        accessor: 'sector'
      },
      {
        header: 'Total Connections',
        accessor: 'totalConnections',
        style: { fontFamily: 'monospace' }
      },
      {
        header: 'Readings Completed',
        accessor: (row) => (
          <div
            className="flex items-center gap-2"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {row.readingsCompleted}
            </span>
            {row.readingsCompleted > 0 && (
              <Button
                variant="outline"
                size="xs"
                color="slate"
                iconOnly
                leftIcon={<List size={14} />}
                onClick={() => openModal(row.sector, 'completed')}
                title="Ver Completadas"
              />
            )}
          </div>
        )
      },
      {
        header: 'Missing Readings',
        accessor: (row) => (
          <div
            className="flex items-center gap-2"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {row.missingReadings}
            </span>
            {row.missingReadings > 0 && (
              <Button
                variant="outline"
                size="xs"
                color="slate"
                iconOnly
                leftIcon={<List size={14} />}
                onClick={() => openModal(row.sector, 'missing')}
                title="Ver Faltantes"
              />
            )}
          </div>
        )
      },
      {
        header: 'Progress Percentage',
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
      <div className="advanced-report-toolbar">
        {/* Unified Search Row */}
        <div className="advanced-toolbar-side">
          <label className="toolbar-label-compact">Period</label>
          <DatePicker
            view="month"
            value={month}
            onChange={(value) => setMonth(value)}
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
          <div className="advanced-toolbar-side actions">
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
                exportService.exportToExcel(
                  filteredData,
                  'advanced_readings_report'
                );
              }}
              disabled={loading || data.length === 0}
              title={t('common.exportExcel', 'Export Excel')}
            />
          </div>
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
              message="No readings for this month"
              description={`No readings found for ${month}`}
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
