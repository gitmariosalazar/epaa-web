import React, { useEffect, useState } from 'react';
import { ReadingNoveltyProvider } from '../../context/ReadingNoveltyContext';
import { useReadingNovelty } from '../../hooks/useReadingNovelty';
import { ReadingNoveltyFilters } from './ReadingNoveltyFilters';
import { ReadingsNoveltyTable } from './ReadingsNoveltyTable';
import { useReadingNoveltySearch } from '../../hooks/useReadingNoveltySearch';
import { dateService } from '@/shared/infrastructure/services/EcuadorDateService';
import { PageLayout } from '@/shared/presentation/components/Layout/PageLayout';
import { NoveltyType } from '@/shared/utils/types/novelties-type';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { CreateReadingPage } from '../../pages';
import { UpdateReadingWithImagesPage } from '../../pages/UpdateReadingWithImagesPage';
import { ReadingDetailModal } from '../ReadingDetailModal';
import { ReadingsProvider } from '../../context/ReadingsContext';
import { UpdateSpecialReadingWithImagesPage } from '../../pages/UpdateSpecialReadingWithImagesPage';
import { useReadingNoveltiesRealtimeSync } from '../../hooks/useReadingNoveltiesRealtimeSync';
interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'update';
  security?: 'protected' | 'public';
  cadastralKey: string;
}

interface ReadingsNoveltyTabViewProps {
  header: React.ReactNode;
  forceSpecialUpdateModal?: boolean;
}

const ReadingsNoveltyContent: React.FC<ReadingsNoveltyTabViewProps> = ({
  header,
  forceSpecialUpdateModal
}) => {
  const currentMonthStr = dateService.getCurrentMonthString();

  const [month, setMonth] = useState(currentMonthStr);
  const [sector, setSector] = useState('');
  const [userId, setUserId] = useState('');
  const [novelty, setNovelty] = useState<string>(NoveltyType.NORMAL);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  // Al inicio de tu componente ReadingsNoveltyContent, donde tienes tus otros useState:
  const [isManualSync, setIsManualSync] = useState(false);



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


  const { readingNovelties, loading, error, fetchNoveltyReadings } =
    useReadingNovelty();


  const {
    searchTerm,
    setSearchTerm,
    noveltySearchTerm,
    setNoveltySearchTerm,
    filteredData
  } = useReadingNoveltySearch(readingNovelties, novelty);


  const handleFetch = () => {
    fetchNoveltyReadings(novelty, month, sector ? Number(sector) : undefined, userId);
  };

  const handleManualFetch = () => {
    setIsManualSync(true);
    handleFetch();
  };

  useEffect(() => {
    if (!loading) {
      setIsManualSync(false);
    }
  }, [loading]);

  useReadingNoveltiesRealtimeSync(month, sector, handleFetch);

  const handleTableAction = (
    mode: 'create' | 'update',
    cadastralKey: string,
    security?: 'protected' | 'public'
  ) => {
    setModalState({ isOpen: true, mode, cadastralKey, security });
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
          onFetch={handleManualFetch}
          isLoading={loading && isManualSync}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          noveltySearchTerm={noveltySearchTerm}
          onNoveltySearchChange={setNoveltySearchTerm}
        />
      }
    >
      {error && (
        <div
          className="entry-data-error"
          style={{ color: 'red', marginTop: '0rem' }}
        >
          <strong>Error: </strong> {error}
        </div>
      )}

      <ReadingsNoveltyTable
        data={filteredData}
        isLoading={loading}
        error={error ? new Error(error) : null}
        month={month}
        novelty={novelty}
        sector={sector}
        onAction={handleTableAction}
        onViewDetails={handleViewDetails}
      />


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
          {modalState?.mode === 'update' && !forceSpecialUpdateModal && modalState?.security !== 'protected' && (
            <UpdateReadingWithImagesPage
              initialCadastralKey={modalState?.cadastralKey}
              initialMonth={month}
              onSuccess={handleModalSuccess}
              onCancel={closeModal}
            />
          )}
          {modalState?.mode === 'update' && (forceSpecialUpdateModal || modalState?.security === 'protected') && (
            <UpdateSpecialReadingWithImagesPage
              initialCadastralKey={modalState?.cadastralKey}
              initialMonth={month}
              onSuccess={handleModalSuccess}
              onCancel={closeModal}
            />
          )}
        </div>
      </Modal>

      <ReadingsProvider>
        <ReadingDetailModal
          isOpen={detailModalState.isOpen}
          onClose={() => setDetailModalState(prev => ({ ...prev, isOpen: false }))}
          cadastralKey={detailModalState.cadastralKey}
          yearAndMonth={detailModalState.yearAndMonth}
        />
      </ReadingsProvider>
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
