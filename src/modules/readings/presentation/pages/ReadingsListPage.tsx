import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle, Calculator, List } from 'lucide-react';

import { Tabs } from '@/shared/presentation/components/Tabs';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { Modal } from '@/shared/presentation/components/Modal/Modal';

import {
  ReadingDataFilters,
  type ReadingDataTab
} from '../components/ReadinsFilters';
import { useReadingsList } from '../hooks/useReadingsList';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';

import { PendingReadingConnectionTable } from '../components/PendingReadingConnectionTable';
import { CompletedReadingConnectionTable } from '../components/CompletedReadingConnectionTable';
import { EstimatedReadingConnectionTable } from '../components/EstimatedReadingConnectionTable';
import { AllReadingsTable } from '../components/AllReadingsTable';
import { CreateReadingPage } from './CreateReadingPage';
import { UpdateReadingPage } from './UpdateReadingPage';

interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'update';
  cadastralKey: string;
}

export const ReadingsListPage: React.FC = () => {
  const { t } = useTranslation();

  const READINGS_TABS: TabItem<ReadingDataTab>[] = useMemo(
    () => [
      {
        id: 'pending',
        label: t('readings.tabs.pending'),
        icon: <Clock size={16} />
      },
      {
        id: 'completed',
        label: t('readings.tabs.completed'),
        icon: <CheckCircle size={16} />
      },
      {
        id: 'estimated',
        label: t('readings.tabs.estimated'),
        icon: <Calculator size={16} />
      },
      { id: 'all', label: t('readings.tabs.all'), icon: <List size={16} /> }
    ],
    [t]
  );

  const [activeTab, setActiveTab] = useState<ReadingDataTab>('pending');
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const currentMonthStr = dateService.getCurrentMonthString();
  const [month, setMonth] = useState(currentMonthStr);
  const [sector, setSector] = useState('');

  const {
    pendingReadings,
    completedReadings,
    estimatedReadings,
    isLoading,
    error,
    fetchReadings
  } = useReadingsList();

  const loadingProgress = useSimulatedProgress(isLoading);

  useEffect(() => {
    setSector('');
  }, [activeTab]);

  const filterBySector = <T extends { sector: number | string }>(list: T[]) => {
    if (!sector) return list;
    return list.filter((item) => String(item.sector).includes(sector));
  };

  const filteredPending = useMemo(
    () => filterBySector(pendingReadings),
    [pendingReadings, sector]
  );
  const filteredCompleted = useMemo(
    () => filterBySector(completedReadings),
    [completedReadings, sector]
  );
  const filteredEstimated = useMemo(
    () => filterBySector(estimatedReadings),
    [estimatedReadings, sector]
  );

  const filteredAll = useMemo(() => {
    return [
      ...filteredPending.map((item) => ({ ...item, _type: 'Pendiente' })),
      ...filteredCompleted.map((item) => ({ ...item, _type: 'Tomada' }))
    ];
  }, [filteredPending, filteredCompleted]);

  const handleTableAction = (mode: 'create' | 'update', cadastralKey: string) => {
    setModalState({ isOpen: true, mode, cadastralKey });
  };

  const closeModal = () => {
    setModalState(null);
  };

  const handleModalSuccess = () => {
    closeModal();
    fetchReadings(activeTab, month, sector);
  };

  return (
    <div
      className="entry-data-page"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <Tabs
        tabs={READINGS_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ReadingDataFilters
        activeTab={activeTab}
        month={month}
        onMonthChange={setMonth}
        sector={sector}
        onSectorChange={setSector}
        onFetch={() => fetchReadings(activeTab, month, sector)}
        isLoading={isLoading}
      />

      {error ? (
        <div
          className="entry-data-error"
          style={{ color: 'red', marginTop: '1rem' }}
        >
          <strong>Error: </strong> {error}
        </div>
      ) : isLoading ? (
        <div
          className="entry-data-loading"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '3rem'
          }}
        >
          <CircularProgress
            progress={loadingProgress}
            size={112}
            strokeWidth={9}
            label={t('common.loading', 'Cargando datos...')}
          />
        </div>
      ) : (
        <>
          {activeTab === 'pending' && (
            <PendingReadingConnectionTable
              data={filteredPending}
              isLoading={isLoading}
              onAction={handleTableAction}
            />
          )}

          {activeTab === 'completed' && (
            <CompletedReadingConnectionTable
              data={filteredCompleted}
              isLoading={isLoading}
              onAction={handleTableAction}
            />
          )}

          {activeTab === 'estimated' && (
            <EstimatedReadingConnectionTable
              data={filteredEstimated}
              isLoading={isLoading}
              onAction={handleTableAction}
            />
          )}

          {activeTab === 'all' && (
            <AllReadingsTable
              data={filteredAll}
              isLoading={isLoading}
            />
          )}
        </>
      )}

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      <Modal
        isOpen={!!modalState?.isOpen}
        onClose={closeModal}
        title=""
        size="full"
      >
        <div style={{ padding: '0px 10px', height: '100%' }}>
          {modalState?.mode === 'create' && (
            <CreateReadingPage
              initialCadastralKey={modalState?.cadastralKey}
              onSuccess={handleModalSuccess}
              onCancel={closeModal}
            />
          )}
          {modalState?.mode === 'update' && (
            <UpdateReadingPage
              initialCadastralKey={modalState?.cadastralKey}
              onSuccess={handleModalSuccess}
              onCancel={closeModal}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};
