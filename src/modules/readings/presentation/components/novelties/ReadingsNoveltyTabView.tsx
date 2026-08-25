import React, { useState } from 'react';
import { ReadingNoveltyProvider } from '../../context/ReadingNoveltyContext';
import { useReadingNovelty } from '../../hooks/useReadingNovelty';
import { ReadingNoveltyFilters } from './ReadingNoveltyFilters';
import { ReadingsNoveltyTable } from './ReadingsNoveltyTable';
import { useReadingNoveltySearch } from '../../hooks/useReadingNoveltySearch';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import {
  CircularProgress,
  useSimulatedProgress
} from '@/shared/presentation/components/CircularProgress';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { NoveltyType } from '@/shared/utils/types/novelties-type';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { CreateReadingPage } from '../../pages';
import { UpdateReadingPage } from '../../pages/UpdateReadingPage';
interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'update';
  cadastralKey: string;
}

interface ReadingsNoveltyTabViewProps {
  header: React.ReactNode;
}

const ReadingsNoveltyContent: React.FC<ReadingsNoveltyTabViewProps> = ({
  header
}) => {
  const { t } = useTranslation();
  const currentMonthStr = dateService.getCurrentMonthString();

  const [month, setMonth] = useState(currentMonthStr);
  const [sector, setSector] = useState('');
  const [userId, setUserId] = useState('');
  const [novelty, setNovelty] = useState<string>(NoveltyType.NORMAL);
  const [modalState, setModalState] = useState<ModalState | null>(null);


  const { readingNovelties, loading, error, fetchNoveltyReadings } =
    useReadingNovelty();


  const {
    searchTerm,
    setSearchTerm,
    noveltySearchTerm,
    setNoveltySearchTerm,
    filteredData
  } = useReadingNoveltySearch(readingNovelties, novelty);

  const loadingProgress = useSimulatedProgress(loading);

  const handleFetch = () => {
    fetchNoveltyReadings(novelty, month, sector ? Number(sector) : undefined, userId);
  };

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
    handleFetch()
  };

  return (
    <PageLayout
      className="reading-novelties-page"
      header={header}
      filters={
        <ReadingNoveltyFilters
          month={month}
          onMonthChange={setMonth}
          sector={sector}
          onSectorChange={setSector}
          novelty={novelty}
          onNoveltyChange={setNovelty}
          userId={userId}
          onUserIdChange={setUserId}
          onFetch={handleFetch}
          isLoading={loading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          noveltySearchTerm={noveltySearchTerm}
          onNoveltySearchChange={setNoveltySearchTerm}
        />
      }
    >
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem',
            width: '100%',
            height: '100%',
            alignItems: 'center'
          }}
        >
          <CircularProgress
            progress={loadingProgress}
            size={112}
            strokeWidth={9}
            label={t('common.loading', 'Cargando datos...')}
          />
        </div>
      ) : error ? (
        <div
          className="entry-data-error"
          style={{ color: 'red', marginTop: '0rem' }}
        >
          <strong>Error: </strong> {error}
        </div>
      ) : (
        <ReadingsNoveltyTable
          data={filteredData}
          isLoading={loading}
          error={error ? new Error(error) : null}
          month={month}
          novelty={novelty}
          sector={sector}
          onAction={handleTableAction}
        />
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
    </PageLayout>
  );
};

export const ReadingsNoveltyTabView: React.FC<ReadingsNoveltyTabViewProps> = (
  props
) => {
  return (
    <ReadingNoveltyProvider>
      <ReadingsNoveltyContent {...props} />
    </ReadingNoveltyProvider>
  );
};
