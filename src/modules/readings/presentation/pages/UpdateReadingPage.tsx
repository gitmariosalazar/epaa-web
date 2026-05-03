import React, { useState, useEffect } from 'react';
import { useUpdateReading } from '../hooks/useUpdateReading';
import { ReadingSummaryCards } from '../components/ReadingSummaryCards';
import { AdditionalInfoAccordion } from '../components/AdditionalInfoAccordion';
import { ReadingHistoryTable } from '../components/ReadingHistoryTable';
import { ReadingToolbar } from '../components/ReadingToolbar';
import { useLocation } from 'react-router-dom';
import type { UpdateReadingRequest } from '../../domain/dto/request/UpdateReadingRequest';
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
import { ReadingConfirmationModal } from '../components/ReadingConfirmationModal';
import { ReadingUpdateInfoForm } from '../components/ReadingUpdateInfoForm';
import { Alert } from '@/shared/presentation/components/Alert';
import '../styles/create-reading.css';

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
    error,
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

  // ── Pre-cargar datos para actualización ───────────────────────────────────────────
  useEffect(() => {
    if (readingInfo && readingInfo.length > 0) {
      const info = readingInfo[0];
      if (info.currentReading !== null && info.currentReading !== undefined) {
        setCurrentReadingInput(info.currentReading);
      } else {
        setCurrentReadingInput('');
      }
    }
  }, [readingInfo]);

  const currentReadingInfoForRequest = readingInfo[0];

  // ── Helpers ───────────────────────────────────────────────────────────────
  const buildRequest = (): UpdateReadingRequest => ({
    previousReading: Number(currentReadingInfoForRequest.previousReading),
    currentReading: Number(currentReadingInput),
    rentalIncomeCode: 0,
    novelty: observationInput,
    incomeCode: 0,
    cadastralKey: currentReadingInfoForRequest.cadastralKey,
    sector: currentReadingInfoForRequest.sector,
    account: currentReadingInfoForRequest.account,
    connectionId: currentReadingInfoForRequest.cadastralKey,
    averageConsumption: Number(currentReadingInfoForRequest.averageConsumption),
    readingMonth: currentReadingInfoForRequest.monthReading
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

          {currentReadingInfoForRequest && (
            <div className="cr-client-badge">
              <IdCard size={16} />
              <span className="cr-client-id">
                {currentReadingInfoForRequest.cardId}
              </span>
              <span style={{ margin: '0 5px', color: '#0067f8ff' }}>|</span>
              <User size={16} />
              <span className="cr-client-name">
                {currentReadingInfoForRequest.clientName}
              </span>
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
          readingInfo={currentReadingInfoForRequest}
          method="update"
        />

        {error && !currentReadingInfoForRequest && (
          <Alert type="error" title="Búsqueda sin resultados" message={error} />
        )}

        {/* ── Estado de la conexión ─────────────────────────────────────────── */}
        {currentReadingInfoForRequest && !currentReadingInfoForRequest.permitReading && (
          <div className="cs-blocked-wrapper">
            {/* ── Encabezado de alerta ── */}
            <div className="cs-alert-header">
              <span className="cs-alert-icon-wrap">
                <ShieldAlert size={22} />
              </span>
              <div className="cs-alert-text">
                <span className="cs-alert-title">Conexión bloqueada para lectura</span>
                <span className="cs-alert-subtitle">
                  Esta conexión no puede recibir nuevas lecturas en su estado actual.
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
                {currentReadingInfoForRequest.connectionStateName
                  .replace(/_/g, ' ')
                  .replace(/([A-Z])/g, ' $1')
                  .trim()}
              </div>
              <div className="cs-state-description">
                <FileText size={13} style={{ marginRight: 6, flexShrink: 0, opacity: 0.7 }} />
                {currentReadingInfoForRequest.connectionStateDescription}
              </div>
            </div>

            {/* ── Ficha de datos ── */}
            <div className="cs-info-grid">
              <div className="cs-info-cell">
                <span className="cs-info-icon"><User size={14} /></span>
                <span className="cs-info-label">Cliente</span>
                <span className="cs-info-value">{currentReadingInfoForRequest.clientName}</span>
              </div>

              <div className="cs-info-cell">
                <span className="cs-info-icon"><Key size={14} /></span>
                <span className="cs-info-label">Clave catastral</span>
                <span className="cs-info-value">{currentReadingInfoForRequest.cadastralKey}</span>
              </div>

              <div className="cs-info-cell">
                <span className="cs-info-icon"><MapPin size={14} /></span>
                <span className="cs-info-label">Sector</span>
                <span className="cs-info-value">{currentReadingInfoForRequest.sector}</span>
              </div>

              <div className="cs-info-cell">
                <span className="cs-info-icon"><Hash size={14} /></span>
                <span className="cs-info-label">Cuenta</span>
                <span className="cs-info-value">{currentReadingInfoForRequest.account}</span>
              </div>

              <div className="cs-info-cell">
                <span className="cs-info-icon"><BarChart2 size={14} /></span>
                <span className="cs-info-label">Consumo promedio</span>
                <span className="cs-info-value">
                  {currentReadingInfoForRequest.averageConsumption}{' '}
                  <small>m³</small>
                </span>
              </div>

              <div className="cs-info-cell">
                <span className="cs-info-icon"><IdCard size={14} /></span>
                <span className="cs-info-label">Identificación</span>
                <span className="cs-info-value">{currentReadingInfoForRequest.cardId}</span>
              </div>
            </div>
          </div>
        )}

        {currentReadingInfoForRequest && currentReadingInfoForRequest.permitReading && (
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

        {currentReadingInfoForRequest && (
          <div className="cr-history-wrapper">
            <ReadingHistoryTable
              history={readingHistory}
              isLoading={isLoadingHistory}
            />
          </div>
        )}

        <>
          <AdditionalInfoAccordion info={currentReadingInfoForRequest} />
        </>
      </div>

      {/* ── Modal de confirmación ─────────────────────────────────────────── */}
      {currentReadingInfoForRequest && (
        <ReadingConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          readingInfo={currentReadingInfoForRequest}
          currentReadingInput={currentReadingInput}
          observationInput={observationInput}
          isSubmitting={isSubmitting}
          method="update"
        />
      )}
    </div>
  );
};
