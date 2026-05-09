import React, { useEffect } from 'react';
import { Modal } from '@/shared/presentation/components/Modal/Modal';
import { ReadingsNoveltyTable } from '@/modules/readings/presentation/components/novelties/ReadingsNoveltyTable';
import { useReadingNovelty } from '@/modules/readings/presentation/hooks/useReadingNovelty';
import { ReadingNoveltyProvider } from '@/modules/readings/presentation/context/ReadingNoveltyContext';
//import { useTranslation } from 'react-i18next';
import { ColorChip } from '@/shared/presentation/components/chip/ColorChip';
import { Calendar, Search } from 'lucide-react';
import { BsPatchQuestionFill } from 'react-icons/bs';
import { getNoveltyColor } from '@/shared/presentation/utils/colors/novelties.colors';
import { Input } from '@/shared/presentation/components/Input/Input';

import { useReadingNoveltySearch } from '@/modules/readings/presentation/hooks/useReadingNoveltySearch';
import { ConvertMonth } from '@/shared/utils/datetime/Converts';

interface NoveltyStatsModalContentProps {
  isOpen: boolean;
  onClose: () => void;
  month: string;
  novelty: string;
}

const NoveltyStatsModalContent: React.FC<NoveltyStatsModalContentProps> = ({
  isOpen,
  onClose,
  month,
  novelty
}) => {
  //const { t } = useTranslation();
  const {
    readingNovelties,
    loading,
    error,
    fetchNoveltyReadings,
    clearNoveltyReadings
  } = useReadingNovelty();

  const { searchTerm, setSearchTerm, filteredData } = useReadingNoveltySearch(
    readingNovelties,
    novelty
  );

  useEffect(() => {
    if (isOpen && novelty && month) {
      fetchNoveltyReadings(novelty, month);
    } else {
      clearNoveltyReadings();
      setSearchTerm('');
    }
  }, [
    isOpen,
    novelty,
    month,
    fetchNoveltyReadings,
    clearNoveltyReadings,
    setSearchTerm
  ]);

  const modalTitle = `Detalle de novedades de lectura`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="full"
      description={`Muestra los detalles de las novedades de lectura para el mes de ${ConvertMonth(Number(month.split('-')[1]))} del año ${month.split('-')[0]}`}
      headerActions={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '1rem'
          }}
        >
          <Input
            placeholder="Buscar Lectura"
            leftIcon={<Search size={16} />}
            size="compact"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <ColorChip
            label={`${ConvertMonth(Number(month.split('-')[1])).toUpperCase()} ${month.split('-')[0].toUpperCase()}`}
            color="#64748b"
            icon={<Calendar size={16} />}
            borderRadius="5px"
            size="md"
          />
          <ColorChip
            label={novelty}
            color={getNoveltyColor(novelty || 'NOT_READ')}
            icon={<BsPatchQuestionFill size={16} />}
            borderRadius="5px"
            size="md"
          />
        </div>
      }
    >
      <div
        style={{
          height: 'calc(100vh - 190px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginTop: '15px'
        }}
      >
        <ReadingsNoveltyTable
          data={filteredData}
          isLoading={loading}
          error={error ? new Error(error) : null}
          month={month}
          novelty={novelty}
          sector=""
        />
      </div>
    </Modal>
  );
};

export const NoveltyStatsModal: React.FC<NoveltyStatsModalContentProps> = (
  props
) => {
  if (!props.isOpen) return null;

  return (
    <ReadingNoveltyProvider>
      <NoveltyStatsModalContent {...props} />
    </ReadingNoveltyProvider>
  );
};
