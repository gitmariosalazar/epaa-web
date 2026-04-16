import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReading } from '../hooks/useReading';
import { ReadingSummaryCards } from '../components/ReadingSummaryCards';
import { ReadingCreateInfoForm } from '../components/ReadingCreateInfoForm';
import { AdditionalInfoAccordion } from '../components/AdditionalInfoAccordion';
import { ReadingHistoryTable } from '../components/ReadingHistoryTable';
import { ReadingToolbar } from '../components/ReadingToolbar';
import { ReadingConfirmationModal } from '../components/ReadingConfirmationModal';
import '../styles/create-reading.css';
import { IdCard, User } from 'lucide-react';
import type { CreateReadingRequest } from '../../domain/dto/request/CreateReadingRequest';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';

export interface CreateReadingPageProps {
  initialCadastralKey?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateReadingPage: React.FC<CreateReadingPageProps> = ({
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
    clearData,
    submitReading
  } = useReading();

  const [cadastralKeyInput, setCadastralKeyInput] = useState('');
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
      setCadastralKeyInput(keyToLoad as string);
      fetchReadingData(keyToLoad as string);
    }
  }, [initialCadastralKey, location.state?.cadastralKey]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Construye el DTO de creación a partir del estado actual del formulario. */
  const buildRequest = (): CreateReadingRequest => ({
    connectionId: readingInfo!.cadastralKey,
    sector: readingInfo!.sector,
    account: readingInfo!.account,
    cadastralKey: readingInfo!.cadastralKey,
    sewerRate: 0,
    previousReading: Number(
      readingInfo!.currentReading !== null
        ? readingInfo!.currentReading
        : readingInfo!.previousReading
    ),
    currentReading: Number(currentReadingInput),
    newCurrentReading: Number(currentReadingInput),
    incomeCode: 0,
    readingDate: new Date(),
    readingTime: new Date().toISOString(),
    readingValue: Number(readingInfo!.readingValue),
    rentalIncomeCode: 0,
    novelty: observationInput,
    averageConsumption: Number(readingInfo!.averageConsumption),
    typeNoveltyReadingId: 1,
    previousMonthReading: readingInfo!.monthReading
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSearch = () => {
    if (!cadastralKeyInput.trim()) {
      MessageToastCustom(
        'error',
        'Ingrese una clave catastral para buscar.',
        'Error',
        { position: 'top-right' }
      );
      return;
    }
    setCurrentReadingInput('');
    setObservationInput('');
    fetchReadingData(cadastralKeyInput.trim());
  };

  /**
   * El botón Guardar sólo valida y abre el modal.
   * (SRP: la validación previa queda aquí, el guardado real en handleConfirm)
   */
  const handleSave = () => {
    if (!readingInfo) {
      alert('Primero debe buscar una conexión.');
      return;
    }
    if (currentReadingInput === '') {
      alert('La lectura actual es obligatoria.');
      return;
    }
    // Abrir modal de confirmación
    setIsConfirmModalOpen(true);
  };

  /**
   * Se ejecuta cuando el usuario presiona "Confirmar y Guardar" dentro del modal.
   */
  const handleConfirm = async () => {
    try {
      const result = await submitReading(buildRequest());
      setIsConfirmModalOpen(false);

      if (result) {
        setIsConfirmModalOpen(false);
        if (onSuccess) {
          onSuccess();
          return;
        }
        await fetchReadingData(cadastralKeyInput);
        setCurrentReadingInput('');
        setObservationInput('');
      }
    } catch {
      // El error ya es manejado dentro del hook useReading
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) setIsConfirmModalOpen(false);
  };

  const handleCancel = () => {
    setCadastralKeyInput('');
    setCurrentReadingInput('');
    setObservationInput('');
    clearData();
    if (onCancel) onCancel();
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="cr-container">
      <div className="cr-content-wrapper">
        <div className="cr-header-container">
          <h2 className="cr-page-title">Registro de Lecturas</h2>

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
          cadastralKeyInput={cadastralKeyInput}
          setCadastralKeyInput={setCadastralKeyInput}
          handleSearch={handleSearch}
          handleSave={handleSave}
          handleCancel={handleCancel}
          isLoadingInfo={isLoadingInfo}
          isSubmitting={isSubmitting}
          readingInfo={readingInfo}
          method="create"
        />

        {readingInfo && (
          <>
            <ReadingSummaryCards
              info={readingInfo}
              currentReadingInput={currentReadingInput}
              method="create"
            />

            <ReadingCreateInfoForm
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
          method="create"
        />
      )}
    </div>
  );
};
