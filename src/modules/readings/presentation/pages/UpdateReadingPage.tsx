import { useUpdateReading } from '../hooks/useUpdateReading';

import { ReadingSummaryCards } from '../components/ReadingSummaryCards';
import { AdditionalInfoAccordion } from '../components/AdditionalInfoAccordion';
import { ReadingHistoryTable } from '../components/ReadingHistoryTable';
import { ReadingToolbar } from '../components/ReadingToolbar';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { UpdateReadingRequest } from '../../domain/dto/request/UpdateReadingRequest';
import { IdCard, User } from 'lucide-react';
import { ReadingConfirmationModal } from '../components/ReadingConfirmationModal';
import { ReadingUpdateInfoForm } from '../components/ReadingUpdateInfoForm';

export interface UpdateReadingPageProps {
  initialCadastralKey?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UpdateReadingPage: React.FC<UpdateReadingPageProps> = ({
  initialCadastralKey,
  onSuccess,
  onCancel
}) => {
  const {
    readingInfo,
    readingHistory,
    isLoadingInfo,
    isLoadingHistory,
    isSubmitting,
    fetchReadingData,
    submitUpdateReading,
    clearData
  } = useUpdateReading();

  const [cadastralKey, setCadastralKey] = useState<string>('');
  const [currentReadingId, setCurrentReadingId] = useState<number | null>(null);
  const [currentReadingInput, setCurrentReadingInput] = useState<number | ''>(
    ''
  );
  const [observationInput, setObservationInput] = useState('');

  // ── Estado del modal de confirmación ──────────────────────────────────────
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // ── Auto cargar desde navegacion o Props ──────────────────────────────────────────
  const location = useLocation();
  useEffect(() => {
    const keyToLoad = initialCadastralKey || location.state?.cadastralKey;
    if (keyToLoad) {
      setCadastralKey(keyToLoad as string);
      fetchReadingData(keyToLoad as string);
    }
  }, [initialCadastralKey, location.state?.cadastralKey]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const buildRequest = (): UpdateReadingRequest => ({
    previousReading: Number(readingInfo!.previousReading),
    currentReading: Number(currentReadingInput),
    rentalIncomeCode: 0,
    novelty: observationInput,
    incomeCode: 0,
    cadastralKey: readingInfo!.cadastralKey,
    sector: readingInfo!.sector,
    account: readingInfo!.account,
    connectionId: readingInfo!.cadastralKey,
    averageConsumption: Number(readingInfo!.averageConsumption),
    readingMonth: readingInfo!.monthReading
  });

  const handleSearch = async () => {
    if (cadastralKey.trim() === '') {
      alert('Por favor, ingrese una clave catastral.');
      return;
    }
    setCurrentReadingId(null);
    setObservationInput('');
    setCurrentReadingInput('');
    await fetchReadingData(cadastralKey);
  };

  const handleSave = () => {
    if (!readingInfo) {
      alert('Primero debe buscar una conexión.');
      return;
    }
    if (currentReadingInput === '') {
      alert('Por favor, ingrese una lectura actual.');
      return;
    }

    // Auto-seleccionar la última lectura para actualizar si no hay una seleccionada
    const latestReadingId = currentReadingId || readingHistory[0]?.readingId;
    if (!latestReadingId) {
      alert('No hay lectura previa en el historial para actualizar.');
      return;
    }
    setCurrentReadingId(latestReadingId);

    // Abrir modal de confirmación (igual que en CreateReadingPage)
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!currentReadingId) return;

    const requestPayload = buildRequest();
    //console.log('--- ENVIANDO DATOS AL BACKEND ---');
    //console.log('ID a actualizar:', currentReadingId);
    //console.log('Payload UpdateReadingRequest:', requestPayload);

    const result = await submitUpdateReading(currentReadingId, requestPayload);
    setIsConfirmModalOpen(false);

    if (result) {
      setIsConfirmModalOpen(false);
      if (onSuccess) {
        onSuccess();
        return;
      }
      await fetchReadingData(cadastralKey);
      setCurrentReadingInput('');
      setObservationInput('');
    }
  };

  //const requestPayload = buildRequest();
  //console.log(requestPayload);

  const handleCloseModal = () => {
    if (!isSubmitting) setIsConfirmModalOpen(false);
  };

  const handleCancel = () => {
    setCadastralKey('');
    setCurrentReadingId(null);
    setObservationInput('');
    setCurrentReadingInput('');
    clearData();
    if (onCancel) onCancel();
  };

  return (
    <div className="cr-container">
      <div className="cr-content-wrapper">
        <div className="cr-header-container">
          <h2 className="cr-page-title">Actualización de Lecturas</h2>

          {readingInfo && (
            <div className="cr-client-badge">
              <IdCard size={16} />
              <span className="cr-client-id">{readingInfo.cardId}</span>
              <span style={{ margin: '0 5px', color: '#0067f8ff' }}>|</span>
              <User size={16} />
              <span className="cr-client-name">{readingInfo.clientName}</span>
            </div>
          )}
        </div>

        <ReadingToolbar
          cadastralKeyInput={cadastralKey}
          setCadastralKeyInput={setCadastralKey}
          handleSearch={handleSearch}
          handleSave={handleSave}
          handleCancel={handleCancel}
          isLoadingInfo={isLoadingInfo}
          isSubmitting={isSubmitting}
          readingInfo={readingInfo}
          method="update"
        />

        {readingInfo && (
          <>
            <ReadingSummaryCards
              info={readingInfo}
              currentReadingInput={currentReadingInput}
              method="update"
            />

            <ReadingUpdateInfoForm
              info={readingInfo}
              currentReadingInput={currentReadingInput}
              setCurrentReadingInput={setCurrentReadingInput}
              observationInput={observationInput}
              setObservationInput={setObservationInput}
            />
          </>
        )}

        {readingInfo && (
          <div className="cr-history-wrapper">
            <ReadingHistoryTable
              history={readingHistory}
              isLoading={isLoadingHistory}
            />
          </div>
        )}

        <>
          <AdditionalInfoAccordion info={readingInfo} />
        </>
      </div>

      {/* ── Modal de confirmación ─────────────────────────────────────────── */}
      {readingInfo && (
        <ReadingConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          readingInfo={readingInfo}
          currentReadingInput={currentReadingInput}
          observationInput={observationInput}
          isSubmitting={isSubmitting}
          method="update"
        />
      )}
    </div>
  );
};
