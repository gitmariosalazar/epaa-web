import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useReading } from '../hooks/useReading';
import { useReadingsContext } from '../context/ReadingsContext';
import { ReadingSummaryCards } from '../components/ReadingSummaryCards';
import { HistoricalReadingCreateInfoForm } from '../components/HistoricalReadingCreateInfoForm';
import { AdditionalInfoAccordion } from '../components/AdditionalInfoAccordion';
import { ReadingHistoryTable } from '../components/ReadingHistoryTable';
import { HistoricalReadingToolbar } from '../components/HistoricalReadingToolbar';
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
import { EmptyState } from '@/shared/presentation/components/common/EmptyState';
import { CircularProgress } from '@/shared/presentation/components/CircularProgress';
import { ReadingDetailModal } from '../components/ReadingDetailModal';
import { checkReadingIsCurrentMonth } from '../../application/usecases/CheckReadingMonthUseCase';
import { PopoverModal } from '@/shared/presentation/components/PopoverModal';
import { ChangeMeterPage } from '@/modules/connections/presentation/pages/ChangeMeterPage';
import { ConnectionProvider } from '@/modules/connections/presentation/context/ConnectionContext';

export interface CreateHistoricalReadingPageProps {
  initialCadastralKey?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const monthMap: Record<string, number> = {
  'ENERO': 1, 'FEBRERO': 2, 'MARZO': 3, 'ABRIL': 4, 'MAYO': 5, 'JUNIO': 6,
  'JULIO': 7, 'AGOSTO': 8, 'SEPTIEMBRE': 9, 'OCTUBRE': 10, 'NOVIEMBRE': 11, 'DICIEMBRE': 12
};

export const CreateHistoricalReadingPage: React.FC<CreateHistoricalReadingPageProps> = ({
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

  const { getReadingHistoryUseCase } = useReadingsContext();

  const [cadastralKeyInput, setCadastralKeyInput] = useState('');
  const [previousReadingInput, setPreviousReadingInput] = useState<number | ''>('');
  const [currentReadingInput, setCurrentReadingInput] = useState<number | ''>('');
  const [observationInput, setObservationInput] = useState('');

  // Empty initially, computed automatically on search
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

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
  };

  // ── Auto cargar desde navegacion o Props ──────────────────────────────────────────
  const location = useLocation();
  useEffect(() => {
    const keyToLoad = initialCadastralKey || location.state?.cadastralKey;
    if (keyToLoad) {
      setCadastralKeyInput(keyToLoad as string);
      // We need to trigger the full search logic if loaded from props
      handleSearch(keyToLoad as string);
    }
  }, [initialCadastralKey, location.state?.cadastralKey]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Construye el DTO de creación a partir del estado actual del formulario. */
  const readingInfoForRequest = readingInfo[0];

  // 1. ¿El mes seleccionado es el mes en curso del sistema?
  const isCurrentMonth = checkReadingIsCurrentMonth(selectedMonth);

  // 2. ¿El mes seleccionado ya existe registrado en el historial?
  const isSelectedMonthInHistory = readingHistory.some((h) => {
    if (!selectedMonth) return false;
    const [selYearStr, selMonthStr] = selectedMonth.split('-');
    const selYear = parseInt(selYearStr, 10);
    const selMonth = parseInt(selMonthStr, 10);
    const hMonthNum = monthMap[h.readingMonth?.toUpperCase()] || parseInt(h.readingMonth, 10);
    return h.readingYear === selYear && hMonthNum === selMonth;
  });

  // 3. Regla de bloqueo:
  // - Si el mes seleccionado ya está en el historial -> BLOQUEADO (evitar duplicado).
  // - Si el mes seleccionado es el mes actual y ya se registró la lectura -> BLOQUEADO.
  // - Si el mes seleccionado es un mes pasado y NO está en el historial -> HABILITADO (permite registrar lectura histórica pendiente).
  const isBlocked = isSelectedMonthInHistory || (isCurrentMonth && !readingInfoForRequest?.hasCurrentReading);
  const permitCreate = !isBlocked;

  useEffect(() => {
    if (readingInfo.length > 0) {
      const info = readingInfo[0];
      if (isBlocked) {
        setPreviousReadingInput(
          info.previousReading !== null && info.previousReading !== undefined
            ? info.previousReading
            : ''
        );
      } else {
        setPreviousReadingInput(
          info.currentReading !== null && info.currentReading !== undefined
            ? info.currentReading
            : info.previousReading
        );
      }
    }
  }, [readingInfo, isBlocked]);

  const buildRequest = (): CreateReadingRequest => ({
    connectionId: readingInfoForRequest.cadastralKey,
    sector: readingInfoForRequest.sector,
    account: readingInfoForRequest.account,
    cadastralKey: readingInfoForRequest.cadastralKey,
    sewerRate: 0,
    previousReading: Number(previousReadingInput),
    currentReading: Number(currentReadingInput),
    newCurrentReading: Number(currentReadingInput),
    incomeCode: 0,
    readingDate: new Date(),
    readingTime: new Date().toISOString(),
    readingValue: Number(readingInfoForRequest.readingValue),
    rentalIncomeCode: 0,
    novelty: observationInput,
    meterStatus: 'NORMAL',
    averageConsumption: Number(readingInfoForRequest.averageConsumption),
    typeNoveltyReadingId: 1,
    currentMonthReading: selectedMonth,
    previousMonthReading: readingInfoForRequest.monthReading
  });


  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSearch = async (overrideKey?: string) => {
    const searchKey = overrideKey || cadastralKeyInput.trim();
    if (!searchKey) {
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
    setIsSearching(true);

    try {
      // 1. Fetch history to compute the next month
      const history = await getReadingHistoryUseCase.execute(searchKey, 1, 0);
      let targetMonthStr = '';

      if (history && history.length > 0) {
        const latest = history[0];
        const monthNum = monthMap[latest.readingMonth.toUpperCase()] || 0;
        if (monthNum > 0) {
          let nextMonthNum = monthNum + 1;
          let nextYear = latest.readingYear;
          if (nextMonthNum > 12) {
            nextMonthNum = 1;
            nextYear += 1;
          }
          targetMonthStr = `${nextYear}-${String(nextMonthNum).padStart(2, '0')}`;
        }
      }

      // If we couldn't compute it (e.g. no history or parsing failed), fallback to current month
      if (!targetMonthStr) {
        const d = new Date();
        targetMonthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      }

      setSelectedMonth(targetMonthStr);
      await fetchReadingData(searchKey, targetMonthStr);
    } catch (e) {
      console.error("Error computing historical month", e);
      // Fallback
      await fetchReadingData(searchKey);
    } finally {
      setIsSearching(false);
    }
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
    if (isBlocked) {
      alert(
        isCurrentMonth
          ? 'La lectura para el mes actual ya se ha registrado.'
          : 'La lectura para este mes histórico ya se encuentra registrada en el historial.'
      );
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
      const requestPayload = buildRequest();
      console.log('🚀 ENVIANDO AL BACKEND:', JSON.stringify(requestPayload, null, 2));

      const result = await submitReading(requestPayload);
      setIsConfirmModalOpen(false);

      if (result) {
        if (onSuccess) {
          onSuccess();
          return;
        }
        await fetchReadingData(cadastralKeyInput, selectedMonth);
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

  const [detailModalState, setDetailModalState] = useState<{ isOpen: boolean; cadastralKey: string | null; yearAndMonth: string | null }>({
    isOpen: false,
    cadastralKey: null,
    yearAndMonth: null,
  });

  const handleViewDetails = (cadastralKey: string, readingDate: Date | null) => {
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
          <h2 className="cr-page-title">Registro de Lecturas Históricas</h2>

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

        <HistoricalReadingToolbar
          cadastralKeyInput={cadastralKeyInput}
          setCadastralKeyInput={setCadastralKeyInput}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          handleSearch={handleSearch}
          handleSave={handleSave}
          handleCancel={handleCancel}
          isLoadingInfo={isLoadingInfo || isSearching}
          isSubmitting={isSubmitting}
          readingInfo={readingInfoForRequest}
          method="create"
          onViewLastReading={handleViewDetails}
          isHistorical={true}
          permitCreate={permitCreate}
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
                  ? readingInfoForRequest.connectionStateName
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

        {/* Mensajes de Estado (Búsqueda Inicial, Sin Resultados, Error) */}
        {
          isLoadingInfo && !readingInfoForRequest && (
            <div className='reading-images-loading'>
              <CircularProgress
                label="Buscando..."
              />
            </div>
          )
        }
        {!readingInfoForRequest && !isLoadingInfo && (
          <div style={{ marginTop: '1rem' }}>
            {error ? (
              <Alert
                type="error"
                title="Error en la búsqueda"
                message={error}
                size='small'
              />
            ) : cadastralKeyInput.trim().length > 0 ? (
              <EmptyState
                variant='warning'
                message="No se encontraron resultados"
                description={`No se han encontrado datos para el predio con clave catastral "${cadastralKeyInput.toUpperCase()}" en el periodo seleccionado.`}
              />
            ) : (
              <Alert
                type="info"
                title="Buscar Conexión"
                message="Seleccione el mes y año, ingrese la clave catastral y presione buscar para cargar los datos históricos."
              />
            )}
          </div>
        )}

        {readingInfoForRequest?.permitReading && (
          <>
            {readingInfoForRequest && (
              <>
                <ReadingSummaryCards
                  info={readingInfo}
                  currentReadingInput={currentReadingInput}
                  method="create"
                  permitCreate={permitCreate}
                />

                <HistoricalReadingCreateInfoForm
                  info={readingInfo}
                  previousReadingInput={previousReadingInput}
                  setPreviousReadingInput={setPreviousReadingInput}
                  currentReadingInput={currentReadingInput}
                  setCurrentReadingInput={setCurrentReadingInput}
                  observationInput={observationInput}
                  setObservationInput={setObservationInput}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  permitCreate={permitCreate}
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
              connectionInfo={{
                cadastralKey: readingInfoForRequest.cadastralKey,
                meterNumber: readingInfoForRequest.meterNumber
              }}
              onUpdateMeterNumber={handleOpenUpdateMeterNumberModal}
            />
          </div>
        )}

        <>
          <AdditionalInfoAccordion info={readingInfoForRequest} />
        </>
      </div>

      <ReadingDetailModal
        isOpen={detailModalState.isOpen}
        onClose={() => setDetailModalState(prev => ({ ...prev, isOpen: false }))}
        cadastralKey={detailModalState.cadastralKey}
        yearAndMonth={detailModalState.yearAndMonth}
      />

      {/* ── Modal de confirmación ─────────────────────────────────────────── */}
      {readingInfoForRequest && (
        <ReadingConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          readingInfo={readingInfoForRequest}
          previousReadingInput={previousReadingInput}
          currentReadingInput={currentReadingInput}
          observationInput={observationInput}
          isSubmitting={isSubmitting}
          method="create"
        />
      )}

      {readingInfoForRequest && (
        <PopoverModal
          isOpen={openUpdateMeterNumberModal}
          onClose={handleCloseUpdateMeterNumberModal}
          anchorElement={anchorEl}
          title="Actualizar número de medidor"
        >
          <ConnectionProvider>
            <ChangeMeterPage
              cadastralKeyProp={readingInfoForRequest?.cadastralKey || cadastralKeyInput}
              onSuccess={handleSuccessUpdateMeterNumberModal}
              onCancel={handleCloseUpdateMeterNumberModal}
            />
          </ConnectionProvider>
        </PopoverModal>
      )}
    </div>
  );
};
