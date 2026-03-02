import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import {
  Table,
  type Column
} from '@/shared/presentation/components/Table/Table';
import { useSectorReadings } from '../../hooks/dashboard/useSectorReadings';
import { ExportService } from '@/shared/infrastructure/services/ExportService';
import type {
  PendingReadingConnection,
  TakenReadingConnection
} from '@/modules/readings/domain/models/Reading';
import { ReportPreviewModal } from '@/shared/presentation/components/reports/ReportPreviewModal';
import type { ExportColumn } from '@/shared/presentation/components/reports/ReportPreviewModal';
import { FilterSectorReadingsUseCase } from '@/modules/readings/application/usecases/FilterSectorReadingsUseCase';
import type { FilterCriteria } from '@/modules/readings/application/usecases/FilterSectorReadingsUseCase';
import './SectorReadingsModal.css';
import { ColorChip } from '../chip/ColorChip';
import { Avatar } from '../Avatar/Avatar';

interface SectorReadingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sector: number | null;
  month: string;
  type: 'completed' | 'missing' | null;
}

export const SectorReadingsModal: React.FC<SectorReadingsModalProps> = ({
  isOpen,
  onClose,
  sector,
  month,
  type
}) => {
  const { t } = useTranslation();
  const { data, loading } = useSectorReadings(sector, month, type);
  const exportService = useMemo(() => new ExportService(), []);

  // PDF Preview State
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [noveltyFilter, setNoveltyFilter] =
    useState<FilterCriteria['noveltyFilter']>('ALL');

  // Column definitions for Table
  const completedColumns: Column<TakenReadingConnection>[] = useMemo(
    () => [
      {
        header: t('dashboard.reports.sectorReadings.columns.ck'),
        accessor: 'cadastralKey',
        sortable: true
      },
      {
        header: t('dashboard.reports.sectorReadings.columns.client'),
        accessor: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar name={row.clientName} size="sm" />
            <div>
              <div style={{ fontWeight: 300 }}>{row.clientName}</div>
              <div
                style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}
              >
                {row.cardId}
              </div>
            </div>
          </div>
        )
      },
      {
        header: t('dashboard.reports.sectorReadings.columns.prevReading'),
        accessor: 'previousReading',
        isNumeric: true
      },
      {
        header: t('dashboard.reports.sectorReadings.columns.currReading'),
        accessor: 'currentReading',
        isNumeric: true
      },
      {
        header: t(
          'dashboard.reports.sectorReadings.columns.calculatedConsumption'
        ),
        accessor: (row) => row.calculatedConsumption + ' m³',
        isNumeric: true
      },
      {
        header: t('dashboard.reports.sectorReadings.columns.novelty'),
        accessor: (row) => {
          return (
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
          );
        }
      },
      { header: t('Medidor'), accessor: 'meterNumber' }
    ],
    [t]
  );

  const missingColumns: Column<PendingReadingConnection>[] = useMemo(
    () => [
      { header: t('C.K.'), accessor: 'cadastralKey', sortable: true },
      {
        header: 'Cliente',
        accessor: (row) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar name={row.clientName} size="sm" />
            <div>
              <div style={{ fontWeight: 300 }}>{row.clientName}</div>
              <div
                style={{ fontSize: '0.85em', color: 'var(--text-secondary)' }}
              >
                {row.cardId}
              </div>
            </div>
          </div>
        )
      },
      { header: t('Medidor'), accessor: 'meterNumber' },
      { header: t('Dirección'), accessor: 'address' },
      {
        header: t('Consumo Promedio'),
        accessor: (row) => {
          const val = Number(row.averageConsumption);
          return isNaN(val) ? '0.00' : val.toFixed(2) + ' m³';
        },
        isNumeric: true
      },
      { header: t('Tarifa'), accessor: 'rateName' }
    ],
    [t]
  );

  // Column definitions for ReportPreviewModal
  const pdfCompletedColumns: ExportColumn[] = useMemo(
    () => [
      { id: 'cadastralKey', label: t('C.K.'), isDefault: true },
      { id: 'clientName', label: t('Cliente'), isDefault: true },
      { id: 'previousReading', label: t('Lect. Ant.'), isDefault: true },
      { id: 'currentReading', label: t('Lect. Act.'), isDefault: true },
      { id: 'calculatedConsumption', label: t('Cons. Calc.'), isDefault: true },
      { id: 'novelty', label: t('Novedad'), isDefault: true },
      { id: 'meterNumber', label: t('Medidor'), isDefault: true }
    ],
    [t]
  );

  const pdfMissingColumns: ExportColumn[] = useMemo(
    () => [
      { id: 'cadastralKey', label: t('C.K.'), isDefault: true },
      { id: 'clientName', label: t('Cliente'), isDefault: true },
      { id: 'meterNumber', label: t('Medidor'), isDefault: true },
      { id: 'address', label: t('Dirección'), isDefault: true },
      { id: 'averageConsumption', label: t('Cons. Prom.'), isDefault: true },
      { id: 'rateName', label: t('Tarifa'), isDefault: true }
    ],
    [t]
  );

  const currentAvailableColumns =
    type === 'completed' ? pdfCompletedColumns : pdfMissingColumns;
  const currentReportTitle =
    type === 'completed'
      ? `Lecturas Completadas - Sector ${sector} - ${month}`
      : `Lecturas Faltantes - Sector ${sector} - ${month}`;

  const mapRowData = (item: any, selectedCols: ExportColumn[]) => {
    const rowData: Record<string, string> = {};

    if (type === 'completed') {
      rowData['cadastralKey'] = item.cadastralKey || '-';
      rowData['clientName'] = item.clientName || '-';
      rowData['previousReading'] = item.previousReading?.toString() || '0';
      rowData['currentReading'] = item.currentReading?.toString() || '0';
      rowData['calculatedConsumption'] =
        item.calculatedConsumption?.toString() || '0';
      rowData['novelty'] = item.novelty || '-';
      rowData['meterNumber'] = item.meterNumber || '-';
    } else {
      rowData['cadastralKey'] = item.cadastralKey || '-';
      rowData['clientName'] = item.clientName || '-';
      rowData['meterNumber'] = item.meterNumber || '-';
      rowData['address'] = item.address || '-';
      rowData['averageConsumption'] =
        item.averageConsumption?.toString() || '0';
      rowData['rateName'] = item.rateName || '-';
    }

    return selectedCols.map((col) => rowData[col.id]);
  };

  const handlePdfGenerator = ({ orientation, selectedColumnIds }: any) => {
    if (!data || data.length === 0) return '';

    const selectedCols = currentAvailableColumns.filter((col) =>
      selectedColumnIds.includes(col.id)
    );
    const colLabels = selectedCols.map((c) => c.label);
    const rows = data.map((d) => mapRowData(d, selectedCols));

    return exportService.generatePdfBlobUrl({
      rows: rows,
      columns: colLabels,
      fileName: `Lecturas_${type === 'completed' ? 'Completadas' : 'Faltantes'}_Sector_${sector}_${month}`,
      title: currentReportTitle,
      orientation
    });
  };

  const handleDownloadPdf = ({ orientation, selectedColumnIds }: any) => {
    if (!data || data.length === 0) return;

    const selectedCols = currentAvailableColumns.filter((col) =>
      selectedColumnIds.includes(col.id)
    );
    const colLabels = selectedCols.map((c) => c.label);
    const rows = data.map((d) => mapRowData(d, selectedCols));

    exportService.exportToPdf({
      rows: rows,
      columns: colLabels,
      fileName: `Lecturas_${type === 'completed' ? 'Completadas' : 'Faltantes'}_Sector_${sector}_${month}`,
      title: currentReportTitle,
      orientation
    });
    setShowPdfPreview(false);
  };

  const filteredData = useMemo(() => {
    if (!data) return [];

    const filterUseCase = new FilterSectorReadingsUseCase();
    const criteria: FilterCriteria = {
      searchTerm,
      noveltyFilter,
      type
    };

    return filterUseCase.execute(data as any[], criteria);
  }, [data, searchTerm, noveltyFilter, type]);

  if (!isOpen) return null;

  return (
    <div className="sector-readings-modal-overlay">
      <div className="sector-readings-modal-content">
        <div className="sector-readings-modal-header">
          <h2 className="sector-readings-modal-title">
            {type === 'completed'
              ? 'Lecturas Completadas'
              : 'Lecturas Faltantes'}
            <span className="sector-readings-sector-badge">
              Sector {sector}
            </span>
          </h2>

          <div className="sector-readings-filters-container">
            <input
              type="text"
              placeholder={t('Buscar por C.K., Cliente o Cédula')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sector-readings-filter-input sector-readings-search-input"
            />
            {type === 'completed' && (
              <select
                value={noveltyFilter}
                onChange={(e) =>
                  setNoveltyFilter(
                    e.target.value as FilterCriteria['noveltyFilter']
                  )
                }
                className="sector-readings-filter-select"
              >
                <option value="ALL">{t('Todas las Novedades')}</option>
                <option value="WITH_NOVELTY">{t('Con Novedad')}</option>
                <option value="WITHOUT_NOVELTY">{t('Sin Novedad')}</option>
              </select>
            )}
          </div>

          <button onClick={onClose} className="sector-readings-modal-close">
            <X size={24} />
          </button>
        </div>

        <div className="sector-readings-modal-body">
          <div className="sector-readings-table-wrapper">
            <Table
              // @ts-ignore
              data={filteredData}
              // @ts-ignore
              columns={type === 'completed' ? completedColumns : missingColumns}
              isLoading={loading}
              pagination={true}
              pageSize={20}
              onExportPdf={() => setShowPdfPreview(true)}
              fullHeight={true}
              emptyState={
                <div className="sector-readings-empty">
                  <p>No se encontraron lecturas para este sector.</p>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* PDF Modal Preview */}
      <ReportPreviewModal
        isOpen={showPdfPreview}
        onClose={() => setShowPdfPreview(false)}
        dataCount={(data || []).length}
        reportTitle={currentReportTitle}
        availableColumns={currentAvailableColumns}
        pdfGenerator={handlePdfGenerator}
        onDownload={handleDownloadPdf}
      />
    </div>
  );
};
