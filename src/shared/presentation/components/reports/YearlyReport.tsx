import { useState, useMemo, useEffect, useCallback } from 'react';
import type {
  MonthlySummary,
  YearlyReadingsReport
} from '@/modules/dashboard/domain/models/report-dashboard.model';
import { GetYearlyReadingsReportUseCase } from '@/modules/dashboard/application/usecases/get-yearly-readings-report.usecase';
import { HttpReportDashboardRepository } from '@/modules/dashboard/infrastructure/repositories/http-report-dashboard.repository';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import { Search, Droplets, FileText, Calendar } from 'lucide-react';
import { Button } from '../Button/Button';
import { EmptyState } from '../common/EmptyState';
import { Table, type Column } from '../Table/Table';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { useTranslation } from 'react-i18next';
import { useTablePdfExport } from '@/shared/presentation/hooks/useTablePdfExport';
import type { ExportColumn } from './ReportPreviewModal';
import './YearlyReport.css';
import { DatePicker } from '../DatePicker/DatePicker';
import { KPICard } from '@/shared/presentation/components/Card/KPICard';

interface YearlyReportProps {
  showToolbar?: boolean;
  showTable?: boolean;
  externalYear?: number;
  onYearChange?: (year: number) => void;
}

export const YearlyReport: React.FC<YearlyReportProps> = ({
  showToolbar = true,
  showTable = true,
  externalYear,
  onYearChange
}) => {
  const { t } = useTranslation();

  const [yearInternal, setYearInternal] = useState<number>(
    dateService.getCurrentDate().getFullYear()
  );

  const year = externalYear ?? yearInternal;
  const setYear = onYearChange ?? setYearInternal;

  const [data, setData] = useState<YearlyReadingsReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const repository = useMemo(() => new HttpReportDashboardRepository(), []);
  const useCase = useMemo(
    () => new GetYearlyReadingsReportUseCase(repository),
    [repository]
  );
  const exportService = useMemo(() => new ExportService(), []);

  const handleSearch = useCallback(
    async (searchYear?: number) => {
      const finalYear = searchYear || year;
      setLoading(true);
      setData(null); // Reset to avoid stale data
      setHasSearched(false);

      try {
        const result = await useCase.execute(finalYear);
        const actualResult = Array.isArray(result) ? result[0] : result;
        setData(actualResult || null);
        setHasSearched(true);
      } catch (error) {
        console.error('Error fetching yearly report', error);
      } finally {
        setLoading(false);
      }
    },
    [year, useCase]
  );

  useEffect(() => {
    if (year) {
      handleSearch(year);
    }
  }, [year, handleSearch]);

  const availableColumns = useMemo(
    () => [
      {
        id: 'month',
        label: t('dashboard.reports.yearly.columns.month', 'Mes'),
        isDefault: true
      },
      {
        id: 'totalReadings',
        label: t(
          'dashboard.reports.yearly.columns.readingsCount',
          'Cant. Lecturas'
        ),
        isDefault: true
      },
      {
        id: 'totalConsumption',
        label: t(
          'dashboard.reports.yearly.columns.totalConsumption',
          'Consumo Total'
        ),
        isDefault: true
      },
      {
        id: 'averageConsumption',
        label: t(
          'dashboard.reports.yearly.columns.averageConsumption',
          'Consumo Promedio'
        ),
        isDefault: true
      },
      {
        id: 'maxConsumption',
        label: t(
          'dashboard.reports.yearly.columns.maxConsumption',
          'Consumo Máximo'
        ),
        isDefault: true
      },
      {
        id: 'minConsumption',
        label: t(
          'dashboard.reports.yearly.columns.minConsumption',
          'Consumo Mínimo'
        ),
        isDefault: true
      },
      {
        id: 'incidentCount',
        label: t(
          'dashboard.reports.yearly.columns.incidentCount',
          'Cant. Incidentes'
        ),
        isDefault: true
      },
      {
        id: 'incidentRatePercentage',
        label: t(
          'dashboard.reports.yearly.columns.incidentRatePercentage',
          'Tasa de Incidentes'
        ),
        isDefault: true
      }
    ],
    [t]
  );

  const mapRowData = useCallback((m: any, selectedCols: ExportColumn[]) => {
    const rowData: Record<string, string> = {
      month: m.month || '-',
      totalReadings: String(m.totalReadings || '0'),
      totalConsumption: `${Number(m.totalConsumption || 0).toFixed(2)} m³`,
      averageConsumption: `${Number(m.averageConsumption || 0).toFixed(2)} m³`,
      maxConsumption: `${Number(m.maxConsumption || 0).toFixed(2)} m³`,
      minConsumption: `${Number(m.minConsumption || 0).toFixed(2)} m³`,
      incidentCount: String(m.incidentCount || '0'),
      incidentRatePercentage: `${Number(m.incidentRatePercentage || 0).toFixed(2)} %`
    };

    return selectedCols.map((col) => rowData[col.id] || '-');
  }, []);

  const totals = useMemo(() => {
    if (!data?.monthlySummaries)
      return {
        readings: 0,
        consumption: 0,
        averageConsumption: 0,
        maxConsumption: 0,
        minConsumption: 0,
        incidentCount: 0,
        incidentRatePercentage: 0
      };
    return data.monthlySummaries.reduce(
      (acc, item) => ({
        readings: acc.readings + Number(item.totalReadings || 0),
        consumption: acc.consumption + Number(item.totalConsumption || 0),
        averageConsumption:
          acc.averageConsumption + Number(item.averageConsumption || 0),
        maxConsumption: acc.maxConsumption + Number(item.maxConsumption || 0),
        minConsumption: acc.minConsumption + Number(item.minConsumption || 0),
        incidentCount: acc.incidentCount + Number(item.incidentCount || 0),
        incidentRatePercentage:
          acc.incidentRatePercentage + Number(item.incidentRatePercentage || 0)
      }),
      {
        readings: 0,
        consumption: 0,
        averageConsumption: 0,
        maxConsumption: 0,
        minConsumption: 0,
        incidentCount: 0,
        incidentRatePercentage: 0
      }
    );
  }, [data]);

  const totalRows = useMemo(
    () => [
      {
        label: t('common.totalRecords', 'Total meses'),
        value: data?.monthlySummaries?.length || 0,
        columnId: 'month'
      },
      {
        label: t(
          'dashboard.reports.yearly.columns.readingsCount',
          'Total Lecturas'
        ),
        value: totals.readings,
        highlight: false,
        columnId: 'totalReadings'
      },
      {
        label: t(
          'dashboard.reports.yearly.columns.totalConsumption',
          'Consumo Total'
        ),
        value: `${Number(totals.consumption).toFixed(2)} m³`,
        highlight: false,
        columnId: 'totalConsumption'
      },
      {
        label: t(
          'dashboard.reports.yearly.columns.averageConsumption',
          'Consumo Promedio'
        ),
        value: `${Number(totals.averageConsumption).toFixed(2)} m³`,
        highlight: false,
        columnId: 'averageConsumption'
      },
      {
        label: t(
          'dashboard.reports.yearly.columns.maxConsumption',
          'Consumo Máximo'
        ),
        value: `${Number(totals.maxConsumption).toFixed(2)} m³`,
        highlight: false,
        columnId: 'maxConsumption'
      },
      {
        label: t(
          'dashboard.reports.yearly.columns.minConsumption',
          'Consumo Mínimo'
        ),
        value: `${Number(totals.minConsumption).toFixed(2)} m³`,
        highlight: false,
        columnId: 'minConsumption'
      },
      {
        label: t(
          'dashboard.reports.yearly.columns.incidentCount',
          'Cant. Incidentes'
        ),
        value: totals.incidentCount,
        highlight: false,
        columnId: 'incidentCount'
      },
      {
        label: t(
          'dashboard.reports.yearly.columns.incidentRatePercentage',
          'Tasa de Incidentes'
        ),
        value: `${Number(totals.incidentRatePercentage).toFixed(2)}%`,
        highlight: false,
        columnId: 'incidentRatePercentage'
      }
    ],
    [t, data, totals]
  );

  const { setShowPdfPreview, PdfPreviewModal } = useTablePdfExport({
    data: data?.monthlySummaries || [],
    availableColumns,
    reportTitle: t(
      'dashboard.reports.yearly.title',
      'REPORTE ANUAL DE LECTURAS'
    ),
    reportDescription: t(
      'dashboard.reports.yearly.description',
      'Resumen mensual de lecturas y consumo por año'
    ),
    labelsHorizontal: {
      [t('common.year', 'Año')]: year.toString(),
      [t('common.exportDate', 'Fecha de Exportación')]:
        new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    },
    totalRows,
    mapRowData
  });

  const handleExportExcel = useCallback(() => {
    if (!data || !data.monthlySummaries) return;

    const selectedCols = availableColumns;
    const colLabels = selectedCols.map((c) => c.label);
    const rows = data.monthlySummaries.map((m) => mapRowData(m, selectedCols));

    const totalsData = selectedCols.map((col, colIndex) => {
      if (colIndex === 0) return 'TOTAL';
      const matchingTotal = totalRows.find((r) => r.columnId === col.id);
      return matchingTotal ? String(matchingTotal.value) : '';
    });

    exportService.exportToExcel({
      rows,
      columns: colLabels,
      fileName: `reporte_anual_${year}`,
      title: t('dashboard.reports.yearly.title', 'REPORTE ANUAL DE LECTURAS'),
      totals: totalsData
    });
  }, [availableColumns, data, mapRowData, totalRows, exportService, year, t]);

  const columns = useMemo<Column<MonthlySummary>[]>(
    () => [
      {
        header: 'Month',
        accessor: 'month',
        className: 'font-medium',
        id: 'month'
      },
      {
        header: 'Readings Count',
        accessor: 'totalReadings',
        id: 'totalReadings',
        isNumeric: true
      },
      {
        header: 'Total Consumption',
        accessor: (row) => `${Number(row.totalConsumption).toFixed(2)} m³`,
        id: 'totalConsumption',
        isNumeric: true
      },
      {
        header: 'Average Consumption',
        accessor: (row) => `${Number(row.averageConsumption).toFixed(2)} m³`,
        id: 'averageConsumption',
        isNumeric: true
      },
      {
        header: 'Max Consumption',
        accessor: (row) => `${Number(row.maxConsumption).toFixed(2)} m³`,
        id: 'maxConsumption',
        isNumeric: true
      },
      {
        header: 'Min Consumption',
        accessor: (row) => `${Number(row.minConsumption).toFixed(2)} m³`,
        id: 'minConsumption',
        isNumeric: true
      },
      {
        header: 'Incident Count',
        accessor: 'incidentCount',
        id: 'incidentCount',
        isNumeric: true
      },
      {
        header: 'Incident Rate Percentage',
        accessor: (row) => `${Number(row.incidentRatePercentage).toFixed(2)}%`,
        id: 'incidentRatePercentage',
        isNumeric: true
      }
    ],
    []
  );

  return (
    <div className="yearly-report-container">
      {showToolbar && (
        <div className="yearly-report-toolbar">
          <div className="yearly-toolbar-side">
            <label className="toolbar-label-compact">Year</label>
            <div style={{ minWidth: '100px' }}>
              <DatePicker
                view="year"
                value={year.toString()}
                onChange={(val: string) => setYear(Number(val))}
                disabled={loading}
                size="compact"
              />
            </div>
            <Button
              onClick={() => handleSearch()}
              isLoading={loading}
              leftIcon={<Search size={14} />}
              size="sm"
              color="primary"
            >
              Calculate
            </Button>
          </div>
        </div>
      )}

      {showTable && data && (
        <>
          <div className="report-content">
            <div className="stats-grid">
              <KPICard
                label="Total Readings"
                value={data.totalReadings}
                icon={<FileText size={20} />}
                color="blue"
                description="Lecturas registradas"
              />
              <KPICard
                label="Avg Consumption"
                value={`${Number(data.averageConsumption).toFixed(2)} m³`}
                icon={<Droplets size={20} />}
                color="green"
                description="Promedio por mes"
              />
              <KPICard
                label="Year"
                value={data.year}
                icon={<Calendar size={20} />}
                color="purple"
                description="Periodo fiscal reportado"
              />
              <KPICard
                label="Year"
                value={data.year}
                icon={<Calendar size={20} />}
                color="purple"
                description="Periodo fiscal reportado"
              />
            </div>
          </div>
          <Table
            data={data.monthlySummaries}
            columns={columns}
            isLoading={loading}
            pagination={true}
            pageSize={15}
            emptyState={
              <EmptyState
                message="No data found"
                description={`No data found for ${year}`}
              />
            }
            onExportPdf={() => setShowPdfPreview(true)}
            onExportExcel={handleExportExcel}
            totalRows={totalRows}
          />
        </>
      )}

      {showTable && !data && (
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
      {showTable && PdfPreviewModal}
    </div>
  );
};
