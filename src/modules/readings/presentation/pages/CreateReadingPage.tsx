import React, { useState } from 'react';
import { useReading } from '../hooks/useReading';
import { ReadingSummaryCards } from '../components/ReadingSummaryCards';
import { ReadingInfoForm } from '../components/ReadingInfoForm';
import { AdditionalInfoAccordion } from '../components/AdditionalInfoAccordion';
import { ReadingHistoryTable } from '../components/ReadingHistoryTable';
import { ReadingToolbar } from '../components/ReadingToolbar';
import { ReadingConfirmationModal } from '../components/ReadingConfirmationModal';
import '../styles/create-reading.css';
import { IdCard, User } from 'lucide-react';
import type { CreateReadingRequest } from '../../domain/dto/request/CreateReadingRequest';

export const CreateReadingPage: React.FC = () => {
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
      alert('Ingrese una clave catastral para buscar.');
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
      await submitReading(buildRequest());
      setIsConfirmModalOpen(false);
      setCurrentReadingInput('');
      setObservationInput('');
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
              <span>-</span>
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
        />

        {readingInfo && (
          <>
            <ReadingSummaryCards
              info={readingInfo}
              currentReadingInput={currentReadingInput}
            />

            <ReadingInfoForm
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
        />
      )}
    </div>
  );
};
