import { useState } from 'react';
import type { AdvancedReportReadings } from '@/modules/dashboard/domain/models/report-dashboard.model';
import { Search, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '@/shared/presentation/components/ProgressBar/ProgressBar';
import { Button } from '@/shared/presentation/components/Button/Button';
import { Table, type Column } from '../Table/Table';
import { getTrafficLightColor } from '../../utils/colors/traffic-lights.colors';
import { useAdvancedReadingsTable } from '@/shared/presentation/hooks/dashboard/useAdvancedReadingsTable';
import { SectorReadingsModal } from './SectorReadingsModal';
import { EmptyState } from '../common/EmptyState';
import { IoInformationCircleOutline } from 'react-icons/io5';

import { CircularProgress } from '../CircularProgress';
import { Tooltip } from '../common/Tooltip/Tooltip';
import { Input } from '../Input/Input';

interface AdvancedReadingsTableProps {
  data: AdvancedReportReadings[];
  loading: boolean;
  currentMonth: string;
}

export const AdvancedReadingsTable = ({
  data,
  loading,
  currentMonth
}: AdvancedReadingsTableProps) => {
  const { t } = useTranslation();

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<number | null>(null);
  const [modalType, setModalType] = useState<'completed' | 'missing' | null>(
    null
  );

  const openModal = (sector: number, type: 'completed' | 'missing') => {
    setSelectedSector(sector);
    setModalType(type);
    setModalOpen(true);
  };

  const {
    searchTerm,
    sortedData,
    sortConfig,
    requestSort,
    handleSearchChange
  } = useAdvancedReadingsTable({ data });

  if (loading)
    return (
      <div
        style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}
      >
        <CircularProgress
          label={t('dashboard.advancedReadings.loading')}
          strokeWidth={6}
          size={110}
        />
      </div>
    );
  if (!data.length)
    return (
      <div style={{ marginTop: '1rem' }}>
        <EmptyState
          message={t('common.noData')}
          description={t('dashboard.advancedReadings.empty')}
          variant="info"
        />
      </div>
    );

  const columns: Column<AdvancedReportReadings>[] = [
    {
      header: t('dashboard.advancedReadings.columns.sector'),
      accessor: (row) => (
        <span className="font-medium" style={{ color: 'var(--primary)' }}>
          {row.sector}
        </span>
      ),
      sortable: true,
      sortKey: 'sector'
    },
    {
      header: t('dashboard.advancedReadings.columns.totalConnections'),
      accessor: (row) => (
        <span className="font-medium" style={{ color: 'var(--text-main)' }}>
          {row.totalConnections}
        </span>
      ),
      sortable: true,
      sortKey: 'totalConnections'
    },
    {
      header: t('dashboard.advancedReadings.columns.readingsCompleted'),
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
      ),
      sortable: true,
      sortKey: 'readingsCompleted'
    },
    {
      header: t('dashboard.advancedReadings.columns.missingReadings'),
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
      ),
      sortable: true,
      sortKey: 'missingReadings',
      isNumeric: true
    },
    {
      header: t('dashboard.advancedReadings.columns.progress'),
      accessor: (row) => (
        <ProgressBar
          value={row.progressPercentage}
          color={getTrafficLightColor(row.progressPercentage)}
          height="8px"
        />
      ),
      className: 'w-48', // Give it some width
      sortable: true,
      sortKey: 'progressPercentage'
    }
  ];

  const totalConnections = sortedData.reduce(
    (total, row) => total + Number(row.totalConnections || 0),
    0
  );

  const totalReadingsCompleted = sortedData.reduce(
    (total, row) => total + Number(row.readingsCompleted || 0),
    0
  );

  const totalMissingReadings = sortedData.reduce(
    (total, row) => total + Number(row.missingReadings || 0),
    0
  );

  const averageProgressPercentage =
    totalConnections > 0
      ? (totalReadingsCompleted / totalConnections) * 100
      : 0;

  // Count distinct values
  const totalUniqueSectors = new Set(sortedData.map((row) => row.sector)).size;

  const averageProgressPercentageText = `${averageProgressPercentage.toFixed(2)}%`;

  const totalRows = [
    {
      label: t('dashboard.advancedReadings.columns.totalConnections'),
      value: totalConnections
    },
    {
      label: t('dashboard.advancedReadings.columns.readingsCompleted'),
      value: totalReadingsCompleted
    },
    {
      label: t('dashboard.advancedReadings.columns.missingReadings'),
      value: totalMissingReadings
    },
    {
      label: t('Total Progress'),
      value: averageProgressPercentageText
    },
    {
      label: t('Total Sectors'),
      value: totalUniqueSectors
    }
  ];

  return (
    <>
      <div
        className="content-card"
        style={{
          height: '100%', // Fill parent height
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          className="card-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0 // Prevent header shrinking
          }}
        >
          <h3>{t('dashboard.advancedReadings.title')}</h3>
          <div style={{ position: 'relative', maxWidth: '200px' }}>
            <Input
              type="text"
              placeholder={t('dashboard.advancedReadings.searchPlaceholder')}
              value={searchTerm}
              onChange={handleSearchChange}
              leftIcon={<Search size={16} />}
            />
          </div>
        </div>
        <Table
          data={sortedData}
          columns={columns}
          pagination={true}
          pageSize={15}
          sortConfig={sortConfig}
          onSort={requestSort}
          totalRows={totalRows}
          containerStyle={{
            flex: 1, // Grow to fill remaining space
            maxHeight: 'none', // Override sticky limitation if needed or keep standard
            overflowY: 'auto',
            borderRadius: '0 0 0.75rem 0.75rem' // Match card radius
          }}
          emptyState={
            <EmptyState
              message={t('common.noResults', 'No se encontraron resultados')}
              icon={IoInformationCircleOutline}
              description={t(
                'common.noResultsDescription',
                'Intenta ajustar los filtros de búsqueda para ver los resultados.'
              )}
              minHeight="300px"
              variant="info"
            />
          }
        />
      </div>

      <SectorReadingsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sector={selectedSector}
        month={currentMonth}
        type={modalType}
      />
    </>
  );
};
