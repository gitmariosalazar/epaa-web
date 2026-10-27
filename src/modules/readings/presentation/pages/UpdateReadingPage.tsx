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
import { checkReadingIsCurrentMonth, formatReadingMonth } from '../../application/usecases/CheckReadingMonthUseCase';
import { Alert } from '@/shared/presentation/components/Alert';
import '../styles/create-reading.css';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { ReadingDetailModal } from '../components/ReadingDetailModal';
import { PopoverModal } from '@/shared/presentation/components/PopoverModal';
import { ConnectionProvider } from '@/modules/connections/presentation/context/ConnectionContext';
import { ChangeMeterPage } from '@/modules/connections/presentation/pages/ChangeMeterPage';

export interface UpdateReadingPageProps {
  initialCadastralKey?: string;
  initialMonth?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  refreshTrigger?: number;
}

export const UpdateReadingPage: React.FC<UpdateReadingPageProps> = ({
  initialCadastralKey,
  initialMonth,
  onSuccess,
  onCancel,
  refreshTrigger
}) => {
  const {
    readingInfo,
    readingInfoForUpdated,
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

  // Modal for to update meter number
  const [openUpdateMeterNumberModal, setOpenUpdateMeterNumberModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenUpdateMeterNumberModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
    setOpenUpdateMeterNumberModal(true);
  };
  const handleCloseUpdateMeterNumberModal = () => {
    setOpenUpdateMeterNumberModal(false);
  };
  const handleSuccessUpdateMeterNumberModal = async () => {
    setOpenUpdateMeterNumberModal(false);
    const activeKey = currentReadingInfoForRequest?.cadastralKey || cadastralKey || initialCadastralKey;
    if (activeKey) {
      await fetchReadingData(activeKey, initialMonth);
    }
  };

  // ── Auto cargar desde navegacion o Props ──────────────────────────────────────────
  const location = useLocation();
  useEffect(() => {
    const keyToLoad = initialCadastralKey || location.state?.cadastralKey;
    if (keyToLoad) {
      setCadastralKey(keyToLoad as string);
      fetchReadingData(keyToLoad as string, initialMonth);
    }
  }, [initialCadastralKey, initialMonth, location.state?.cadastralKey, refreshTrigger]);

  // ── Pre-cargar datos para actualización ───────────────────────────────────────────
  useEffect(() => {
    const info = readingInfoForUpdated.length > 0 ? readingInfoForUpdated[0] : (readingInfo && readingInfo.length > 0 ? readingInfo[0] : null);
    if (info) {
      if (info.readingId) {
        setCurrentReadingId(info.readingId);
      }
      if (info.currentReading !== null && info.currentReading !== undefined) {
        setCurrentReadingInput(info.currentReading);
      } else {
        setCurrentReadingInput('');
      }
    }
  }, [readingInfo, readingInfoForUpdated]);

  const currentReadingInfoForRequest = readingInfoForUpdated.length > 0 ? readingInfoForUpdated[0] : readingInfo[0];

  // ── Helpers ───────────────────────────────────────────────────────────────
  const buildRequest = (): UpdateReadingRequest => ({
    previousReading: Number(currentReadingInfoForRequest.previousReading),
    currentReading: Number(currentReadingInput),
    rentalIncomeCode: 0,
    novelty: observationInput,
    meterStatus: 'NORMAL',
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
    await fetchReadingData(cadastralKey, initialMonth);
  };

  /**
   * handleSave
   * El modal de advertencia ya fue mostrado al buscar.
   * Aquí siempre se abre la confirmación directamente.
   */
  const handleSave = () => {
    if (!readingInfo) {
      alert('Primero debe buscar una conexión.');
      return;
    }
    if (currentReadingInput === '') {
      alert('Por favor, ingrese una lectura actual.');
      return;
    }

    // Auto-seleccionar la lectura para actualizar si no hay una seleccionada
    const latestReadingId = currentReadingId || currentReadingInfoForRequest?.readingId;
    if (!latestReadingId) {
      alert('No hay lectura previa en el historial para actualizar.');
      return;
    }
    setCurrentReadingId(latestReadingId);

    // Ir directo a confirmación (la advertencia ya se mostró al buscar)
    setIsConfirmModalOpen(true);
  };

  const handleConfirm = async () => {
    const readingIdToUpdate = currentReadingId || currentReadingInfoForRequest?.readingId;
    if (!readingIdToUpdate) return;

    const requestPayload = buildRequest();

    const result = await submitUpdateReading(readingIdToUpdate, requestPayload);
    setIsConfirmModalOpen(false);

    if (result) {
      if (onSuccess) {
        onSuccess();
        return;
      }

      // Recargar datos actualizados automáticamente
      const activeKey = currentReadingInfoForRequest?.cadastralKey || cadastralKey || initialCadastralKey;
      if (activeKey) {
        await fetchReadingData(activeKey, initialMonth);
      }
    }
  };

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

  const [detailModalState, setDetailModalState] = useState<{
    isOpen: boolean;
    cadastralKey: string | null;
    yearAndMonth: string | null;
  }>({
    isOpen: false,
    cadastralKey: null,
    yearAndMonth: null
  });

  const handleViewDetails = (
    cadastralKey: string,
    readingDate: Date | null
  ) => {
    // Tomamos por defecto el monthReading que viene del backend
    let yearAndMonth = readingInfo[0]?.monthReading || '';

    // Verificamos que readingDate exista Y que sea una fecha VÁLIDA (!isNaN)
    if (readingDate && !isNaN(readingDate.getTime())) {
      const d = new Date(readingDate);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      yearAndMonth = `${y}-${m}`;
    }

    setDetailModalState({ isOpen: true, cadastralKey, yearAndMonth });
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
          onViewLastReading={handleViewDetails}
        />

        {/* ── Estado de la conexión ─────────────────────────────────────────── */}
        {currentReadingInfoForRequest &&
          !currentReadingInfoForRequest.permitReading && (
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
                <div className="cs-state-label">
                  Estado actual de la conexión
                </div>
                <div className="cs-state-name">
                  <Tag size={15} style={{ marginRight: 6, flexShrink: 0 }} />
                  {currentReadingInfoForRequest.connectionStateName
                    ? currentReadingInfoForRequest.connectionStateName
                      .replace(/_/g, ' ')
                      .replace(/([A-Z])/g, ' $1')
                      .trim()
                    : 'Estado Desconocido'}
                </div>
                <div className="cs-state-description">
                  <FileText
                    size={13}
                    style={{ marginRight: 6, flexShrink: 0, opacity: 0.7 }}
                  />
                  {currentReadingInfoForRequest.connectionStateDescription}
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
                    {currentReadingInfoForRequest.clientName}
                  </span>
                </div>

                <div className="cs-info-cell">
                  <span className="cs-info-icon">
                    <Key size={14} />
                  </span>
                  <span className="cs-info-label">Clave catastral</span>
                  <span className="cs-info-value">
                    {currentReadingInfoForRequest.cadastralKey}
                  </span>
                </div>

                <div className="cs-info-cell">
                  <span className="cs-info-icon">
                    <MapPin size={14} />
                  </span>
                  <span className="cs-info-label">Sector</span>
                  <span className="cs-info-value">
                    {currentReadingInfoForRequest.sector}
                  </span>
                </div>

                <div className="cs-info-cell">
                  <span className="cs-info-icon">
                    <Hash size={14} />
                  </span>
                  <span className="cs-info-label">Cuenta</span>
                  <span className="cs-info-value">
                    {currentReadingInfoForRequest.account}
                  </span>
                </div>

                <div className="cs-info-cell">
                  <span className="cs-info-icon">
                    <BarChart2 size={14} />
                  </span>
                  <span className="cs-info-label">Consumo promedio</span>
                  <span className="cs-info-value">
                    {currentReadingInfoForRequest.averageConsumption}{' '}
                    <small>m³</small>
                  </span>
                </div>

                <div className="cs-info-cell">
                  <span className="cs-info-icon">
                    <IdCard size={14} />
                  </span>
                  <span className="cs-info-label">Identificación</span>
                  <span className="cs-info-value">
                    {currentReadingInfoForRequest.cardId}
                  </span>
                </div>
              </div>
            </div>
          )}

        {/* Mensajes de Estado (Búsqueda Inicial, Sin Resultados, Error) */}
        {isLoadingInfo && !currentReadingInfoForRequest && (
          <div className="reading-images-loading">
            <CircularProgress label="Buscando..." />
          </div>
        )}
        {!currentReadingInfoForRequest && !isLoadingInfo && (
          <div style={{ marginTop: '1rem' }}>
            {error ? (
              <Alert
                type="error"
                title="Error en la búsqueda"
                message={error}
                size='small'
              />
            ) : cadastralKey.trim().length > 0 ? (
              <EmptyState
                variant="warning"

                message="No se encontraron resultados"
                description={`No se han encontrado datos para el predio con clave catastral "${cadastralKey.toUpperCase()}".`}

              />
            ) : (
              <Alert
                type="info"
                title="Buscar Conexión"
                size='small'
                message="Ingrese la clave catastral en la barra superior y presione buscar para cargar los datos."
              />
            )}
          </div>
        )}

        {currentReadingInfoForRequest &&
          currentReadingInfoForRequest.permitReading && (
            <>
              {!checkReadingIsCurrentMonth(currentReadingInfoForRequest.monthReading) && (
                <div style={{ marginTop: '0.09rem', marginBottom: '-0.9rem' }}>
                  <Alert
                    type="warning"
                    title={`Advertencia de Facturación — Lectura de Mes Anterior (${formatReadingMonth(currentReadingInfoForRequest.monthReading)})`}
                    message="Esta lectura posiblemente ya fue facturada en el ciclo correspondiente. Modificar este valor puede generar inconsistencias en los registros contables y en el historial del cliente."
                    size="small"
                    dismissible={false}
                  />
                </div>
              )}

              <ReadingSummaryCards
                info={readingInfo}
                currentReadingInput={currentReadingInput}
                method="update"
              />

              <ReadingUpdateInfoForm
                info={readingInfoForUpdated.length > 0 ? readingInfoForUpdated : readingInfo}
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
              connectionInfo={{
                cadastralKey: currentReadingInfoForRequest.cadastralKey,
                meterNumber: currentReadingInfoForRequest.meterNumber,
              }}
              isLoading={isLoadingHistory}
              onUpdateMeterNumber={handleOpenUpdateMeterNumberModal}
            />
          </div>
        )}

        <>
          <AdditionalInfoAccordion info={currentReadingInfoForRequest} />
        </>
      </div>

      <ReadingDetailModal
        isOpen={detailModalState.isOpen}
        onClose={() =>
          setDetailModalState((prev) => ({ ...prev, isOpen: false }))
        }
        cadastralKey={detailModalState.cadastralKey}
        yearAndMonth={detailModalState.yearAndMonth}
      />

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

      {currentReadingInfoForRequest && (
        <PopoverModal
          isOpen={openUpdateMeterNumberModal}
          onClose={handleCloseUpdateMeterNumberModal}
          anchorElement={anchorEl}
          title="Actualizar número de medidor"
        >
          <ConnectionProvider>
            <ChangeMeterPage
              cadastralKeyProp={currentReadingInfoForRequest?.cadastralKey || cadastralKey || initialCadastralKey || ''}
              onSuccess={handleSuccessUpdateMeterNumberModal}
              onCancel={handleCloseUpdateMeterNumberModal}
            />
          </ConnectionProvider>
        </PopoverModal>
      )}
    </div>
  );
};
