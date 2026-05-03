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
import {
  IdCard,
  User,
  ShieldAlert,
  MapPin,
  Hash,
  BarChart2,
  Key,
  Tag,
  FileText
} from 'lucide-react';
import type { CreateReadingRequest } from '../../domain/dto/request/CreateReadingRequest';
import { MessageToastCustom } from '@/shared/presentation/components/toast/CustomMessageToast';
import { Alert } from '@/shared/presentation/components/Alert';

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
    submitReading,
    error
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
  const readingInfoForRequest = readingInfo[0];
  const buildRequest = (): CreateReadingRequest => ({
    connectionId: readingInfoForRequest.cadastralKey,
    sector: readingInfoForRequest.sector,
    account: readingInfoForRequest.account,
    cadastralKey: readingInfoForRequest.cadastralKey,
    sewerRate: 0,
    previousReading: Number(
      readingInfoForRequest.currentReading !== null
        ? readingInfoForRequest.currentReading
        : readingInfoForRequest.previousReading
    ),
    currentReading: Number(currentReadingInput),
    newCurrentReading: Number(currentReadingInput),
    incomeCode: 0,
    readingDate: new Date(),
    readingTime: new Date().toISOString(),
    readingValue: Number(readingInfoForRequest.readingValue),
    rentalIncomeCode: 0,
    novelty: observationInput,
    averageConsumption: Number(readingInfoForRequest.averageConsumption),
    typeNoveltyReadingId: 1,
    previousMonthReading: readingInfoForRequest.monthReading
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
    if (!readingInfoForRequest) {
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

          {readingInfoForRequest && (
            <div className="cr-client-badge">
              <IdCard size={16} />
              <span className="cr-client-id">
                {readingInfoForRequest.cardId}
              </span>
              <span style={{ margin: '0 5px', color: '#0067f8ff' }}>|</span>
              <User size={16} />
              <span className="cr-client-name">
                {readingInfoForRequest.clientName}
              </span>
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
          readingInfo={readingInfoForRequest}
          method="create"
        />

        {/* ── Estado de la conexión ─────────────────────────────────────────── */}
        {readingInfoForRequest && !readingInfoForRequest.permitReading && (
          <div className="cs-blocked-wrapper">
            {/* ── Encabezado de alerta ── */}
            <div className="cs-alert-header">
              <span className="cs-alert-icon-wrap">
                <ShieldAlert size={22} />
              </span>
              <div className="cs-alert-text">
                <span className="cs-alert-title">
                  Conexión bloqueada para lectura
                </span>
                <span className="cs-alert-subtitle">
                  Esta conexión no puede recibir nuevas lecturas en su estado
                  actual.
                </span>
              </div>
              <span className="cs-no-permit-badge">
                <ShieldAlert size={12} style={{ marginRight: 4 }} />
                Lectura no permitida
              </span>
            </div>

            {/* ── Estado actual ── */}
            <div className="cs-state-banner">
              <div className="cs-state-label">Estado actual de la conexión</div>
              <div className="cs-state-name">
                <Tag size={15} style={{ marginRight: 6, flexShrink: 0 }} />
                {readingInfoForRequest.connectionStateName
                  .replace(/_/g, ' ')
                  .replace(/([A-Z])/g, ' $1')
                  .trim()}
              </div>
              <div className="cs-state-description">
                <FileText
                  size={13}
                  style={{ marginRight: 6, flexShrink: 0, opacity: 0.7 }}
                />
                {readingInfoForRequest.connectionStateDescription}
              </div>
            </div>

            {/* ── Ficha de datos ── */}
            <div className="cs-info-grid">
              <div className="cs-info-cell">
                <span className="cs-info-icon">
                  <User size={14} />
                </span>
                <span className="cs-info-label">Cliente</span>
                <span className="cs-info-value">
                  {readingInfoForRequest.clientName}
                </span>
              </div>

              <div className="cs-info-cell">
                <span className="cs-info-icon">
                  <Key size={14} />
                </span>
                <span className="cs-info-label">Clave catastral</span>
                <span className="cs-info-value">
                  {readingInfoForRequest.cadastralKey}
                </span>
              </div>

              <div className="cs-info-cell">
                <span className="cs-info-icon">
                  <MapPin size={14} />
                </span>
                <span className="cs-info-label">Sector</span>
                <span className="cs-info-value">
                  {readingInfoForRequest.sector}
                </span>
              </div>

              <div className="cs-info-cell">
                <span className="cs-info-icon">
                  <Hash size={14} />
                </span>
                <span className="cs-info-label">Cuenta</span>
                <span className="cs-info-value">
                  {readingInfoForRequest.account}
                </span>
              </div>

              <div className="cs-info-cell">
                <span className="cs-info-icon">
                  <BarChart2 size={14} />
                </span>
                <span className="cs-info-label">Consumo promedio</span>
                <span className="cs-info-value">
                  {readingInfoForRequest.averageConsumption} <small>m³</small>
                </span>
              </div>

              <div className="cs-info-cell">
                <span className="cs-info-icon">
                  <IdCard size={14} />
                </span>
                <span className="cs-info-label">Identificación</span>
                <span className="cs-info-value">
                  {readingInfoForRequest.cardId}
                </span>
              </div>
            </div>
          </div>
        )}

        {readingInfoForRequest?.permitReading && (
          <>
            {error && !readingInfoForRequest && (
              <Alert
                type="error"
                title="Búsqueda sin resultados"
                message={error}
              />
            )}

            {readingInfoForRequest && (
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
          </>
        )}

        {readingInfoForRequest && (
          <div className="cr-history-wrapper">
            <ReadingHistoryTable
              history={readingHistory}
              isLoading={isLoadingHistory}
            />
          </div>
        )}

        <>
          <AdditionalInfoAccordion info={readingInfoForRequest} />
        </>
      </div>

      {/* ── Modal de confirmación ─────────────────────────────────────────── */}
      {readingInfoForRequest && (
        <ReadingConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          readingInfo={readingInfoForRequest}
          currentReadingInput={currentReadingInput}
          observationInput={observationInput}
          isSubmitting={isSubmitting}
          method="create"
        />
      )}
    </div>
  );
};
