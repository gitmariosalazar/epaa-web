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
import { UpdateReadingWithImagesPage } from './UpdateReadingWithImagesPage';
import { BsPatchQuestionFill } from 'react-icons/bs';
import { ReadingsNoveltyTabView } from '../components/novelties/ReadingsNoveltyTabView';
import { ReadingDetailModal } from '../components/ReadingDetailModal';
import { ConnectionProvider } from '@/modules/connections/presentation/context/ConnectionContext';
import { ConnectionDetailModal } from '@/modules/connections/presentation/components/ConnectionDetailModal';

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
  const [globalSearch, setGlobalSearch] = useState('');

  const [detailModalState, setDetailModalState] = useState<{ isOpen: boolean; cadastralKey: string | null; yearAndMonth: string | null }>({
    isOpen: false,
    cadastralKey: null,
    yearAndMonth: null,
  });

  // Detail Modal State for Connection
  const [detailCadastralKey, setDetailCadastralKey] = useState<string | null>(null);

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
    setGlobalSearch('');
    clearAll();
  }, [activeTab]);

  const filterData = <T extends { sector: number | string; cadastralKey?: string; clientName?: string; meterNumber?: string }>(list: T[]) => {
    let filtered = list;

    // Filter by sector
    if (sector) {
      filtered = filtered.filter((item) => String(item.sector).includes(sector));
    }

    // Filter by global search
    if (globalSearch) {
      const lowerSearch = globalSearch.toLowerCase();
      filtered = filtered.filter((item) =>
        (item.cadastralKey && String(item.cadastralKey).toLowerCase().includes(lowerSearch)) ||
        (item.clientName && String(item.clientName).toLowerCase().includes(lowerSearch)) ||
        (item.meterNumber && String(item.meterNumber).toLowerCase().includes(lowerSearch))
      );
    }

    return filtered;
  };

  const filteredPending = useMemo(
    () => filterData(pendingReadings),
    [pendingReadings, sector, globalSearch]
  );
  const filteredCompleted = useMemo(
    () => filterData(completedReadings),
    [completedReadings, sector, globalSearch]
  );
  const filteredEstimated = useMemo(
    () => filterData(estimatedReadings),
    [estimatedReadings, sector, globalSearch]
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
          search={globalSearch}
          onSearchChange={setGlobalSearch}
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
              onViewConnectionDetails={(key) => setDetailCadastralKey(key)}
            />
          )}

          {activeTab === 'completed' && (
            <CompletedReadingConnectionTable
              data={filteredCompleted}
              isLoading={isLoading}
              onAction={handleTableAction}
              onViewDetails={handleViewDetails}
              onViewConnectionDetails={(key) => setDetailCadastralKey(key)}
            />
          )}

          {activeTab === 'estimated' && (
            <EstimatedReadingConnectionTable
              data={filteredEstimated}
              isLoading={isLoading}
              onAction={handleTableAction}
              onViewDetails={handleViewDetails}
              onViewConnectionDetails={(key) => setDetailCadastralKey(key)}
            />
          )}

          {activeTab === 'all' && (
            <AllReadingsTable
              data={filteredAll}
              isLoading={isLoading}
              onAction={handleTableAction}
              onViewReadingDetails={handleViewDetails}
              onViewConnectionDetails={(key) => setDetailCadastralKey(key)}
            />
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
            <UpdateReadingWithImagesPage
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

      <ConnectionProvider>
        <ConnectionDetailModal
          isOpen={detailCadastralKey !== null}
          onClose={() => setDetailCadastralKey(null)}
          cadastralKey={detailCadastralKey}
        />
      </ConnectionProvider>
    </PageLayout>
  );
};
