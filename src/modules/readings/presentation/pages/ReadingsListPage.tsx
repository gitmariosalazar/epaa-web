import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle, Calculator, List } from 'lucide-react';

import { Tabs } from '@/shared/presentation/components/Tabs';
import type { TabItem } from '@/shared/presentation/components/Tabs';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
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
import { BsPatchQuestionFill } from 'react-icons/bs';
import { ReadingsNoveltyTabView } from '../components/novelties/ReadingsNoveltyTabView';
import { ReadingDetailModal } from '../components/ReadingDetailModal';

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
      { id: 'all', label: t('readings.tabs.all'), icon: <List size={16} /> },
      {
        id: 'novelties',
        label: t('readings.tabs.novelties', 'Novedades'),
        icon: <BsPatchQuestionFill size={16} />
      }
    ],
    [t]
  );

  const [activeTab, setActiveTab] = useState<ReadingDataTab>('pending');
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const currentMonthStr = dateService.getCurrentMonthString();
  const [month, setMonth] = useState(currentMonthStr);
  const [sector, setSector] = useState('');
  const [userId, setUserId] = useState('');

  const [detailModalState, setDetailModalState] = useState<{ isOpen: boolean; cadastralKey: string | null; yearAndMonth: string | null }>({
    isOpen: false,
    cadastralKey: null,
    yearAndMonth: null,
  });

  const handleViewDetails = (cadastralKey: string, readingDate: Date | null) => {
    let yearAndMonth = month;
    if (readingDate) {
       const d = new Date(readingDate);
       const y = d.getFullYear();
       const m = String(d.getMonth() + 1).padStart(2, '0');
       yearAndMonth = `${y}-${m}`;
    }
    setDetailModalState({ isOpen: true, cadastralKey, yearAndMonth });
  };

  const {
    pendingReadings,
    completedReadings,
    estimatedReadings,
    isLoading,
    error,
    fetchReadings,
    clearAll
  } = useReadingsList();

  const loadingProgress = useSimulatedProgress(isLoading);

  useEffect(() => {
    setSector('');
    setUserId('');
    clearAll();
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

  const handleTableAction = (
    mode: 'create' | 'update',
    cadastralKey: string
  ) => {
    setModalState({ isOpen: true, mode, cadastralKey });
  };

  const closeModal = () => {
    setModalState(null);
  };

  const handleModalSuccess = () => {
    closeModal();
    fetchReadings(activeTab as any, month, sector, userId);
  };

  if (activeTab === 'novelties') {
    return (
      <ReadingsNoveltyTabView
        header={
          <Tabs
            tabs={READINGS_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        }
      />
    );
  }

  return (
    <PageLayout
      className="reading-images-page"
      header={
        <Tabs
          tabs={READINGS_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      }
      filters={
        <ReadingDataFilters
          activeTab={activeTab as any}
          month={month}
          onMonthChange={setMonth}
          sector={sector}
          onSectorChange={setSector}
          userId={userId}
          onUserIdChange={setUserId}
          onFetch={() => fetchReadings(activeTab as any, month, sector, userId)}
          isLoading={isLoading}
        />
      }
    >
      {error ? (
        <div
          className="entry-data-error"
          style={{ color: 'red', marginTop: '0rem' }}
        >
          <strong>Error: </strong> {error}
        </div>
      ) : isLoading ? (
        <div
          className="entry-data-loading"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '0rem'
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
              onViewDetails={handleViewDetails}
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
            <AllReadingsTable data={filteredAll} isLoading={isLoading} />
          )}
        </>
      )}

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      <Modal
        isOpen={!!modalState?.isOpen}
        onClose={closeModal}
        title={
          modalState?.mode === 'create' ? 'Nueva Lectura' : 'Editar Lectura'
        }
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

      <ReadingDetailModal
        isOpen={detailModalState.isOpen}
        onClose={() => setDetailModalState(prev => ({ ...prev, isOpen: false }))}
        cadastralKey={detailModalState.cadastralKey}
        yearAndMonth={detailModalState.yearAndMonth}
      />
    </PageLayout>
  );
};
