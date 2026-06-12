/**
 * RegisterCadastralModal — Presentation Layer
 *
 * Fase 14 del proceso de Acometidas: Registro catastral y activación del
 * servicio de agua, OBLIGATORIO antes de marcar la OT de instalación como Completada.
 *
 * Clean Architecture:
 *   - Presentación pura: recibe onSubmit como callback (DIP).
 *   - Sin lógica de negocio: toda validación vive en RegisterCadastralUseCase.
 *
 * SOLID:
 *   SRP: única responsabilidad — capturar los datos catastrales de la instalación.
 *   OCP: extensible con nuevos campos sin romper el componente.
 *   DIP: onSubmit recibe el comando tipado; no conoce el repositorio ni el servicio.
 */
import React, { useState, useCallback } from 'react';
import {
  Hash, MapPin, Gauge,
  AlertCircle, Info, ChevronDown, User,
} from 'lucide-react';
import { WoModalShell } from './WoModalShell';
import type { RegisterCadastralDto } from '../../../../processes/solicitudes/domain/repositories/SolicitudRepository';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface RegisterCadastralCommand
  extends Omit<RegisterCadastralDto, 'registratorId' | 'solicitudId'> {}

interface Props {
  isOpen:        boolean;
  onClose:       () => void;
  orderCode:     string;
  solicitudId:   string;
  registratorId: string;
  contractId?:   string;
  /** Dirección pre-llenada desde la OT */
  defaultAddress?: string;
  /** Fecha de hoy como fecha de instalación por defecto */
  defaultDate?: string;
  onSubmit: (dto: RegisterCadastralDto) => Promise<void>;
  isLoading?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
export const RegisterCadastralModal: React.FC<Props> = ({
  isOpen,
  onClose,
  orderCode,
  solicitudId,
  registratorId,
  contractId,
  defaultAddress = '',
  defaultDate    = new Date().toISOString().split('T')[0],
  onSubmit,
  isLoading = false,
}) => {
  // ── Form state ─────────────────────────────────────────────────────────────
  const [cadastralKey,       setCadastralKey]       = useState('');
  const [meterNumber,        setMeterNumber]         = useState('');
  const [exactAddress,       setExactAddress]        = useState(defaultAddress);
  const [longitude,          setLongitude]           = useState('');
  const [latitude,           setLatitude]            = useState('');
  const [connectionDiameter, setConnectionDiameter]  = useState('');
  const [serviceType,        setServiceType]         = useState('RESIDENCIAL');
  const [installationDate,   setInstallationDate]    = useState(defaultDate);
  const [accountNumber,      setAccountNumber]       = useState('');
  const [showCoords,         setShowCoords]          = useState(false);
  const [error,              setError]               = useState<string | null>(null);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setCadastralKey('');
    setMeterNumber('');
    setExactAddress(defaultAddress);
    setLongitude('');
    setLatitude('');
    setConnectionDiameter('');
    setServiceType('RESIDENCIAL');
    setInstallationDate(defaultDate);
    setAccountNumber('');
    setShowCoords(false);
    setError(null);
    onClose();
  }, [onClose, defaultAddress, defaultDate]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones requeridas (igual que las del repositorio)
    if (!cadastralKey.trim())     { setError('La clave catastral es requerida.');    return; }
    if (!meterNumber.trim())      { setError('El número de medidor es requerido.');  return; }
    if (!exactAddress.trim())     { setError('La dirección exacta es requerida.');   return; }
    if (!accountNumber.trim())    { setError('El número de cuenta es requerido.');   return; }
    if (!installationDate.trim()) { setError('La fecha de instalación es requerida.'); return; }

    const dto: RegisterCadastralDto = {
      solicitudId,
      registratorId,
      cadastralKey:       cadastralKey.trim(),
      meterNumber:        meterNumber.trim(),
      exactAddress:       exactAddress.trim(),
      accountNumber:      accountNumber.trim(),
      installationDate,
      contractId:         contractId,
      connectionDiameter: connectionDiameter || undefined,
      serviceType:        serviceType || undefined,
      longitude:          longitude ? parseFloat(longitude) : 0,
      latitude:           latitude  ? parseFloat(latitude)  : 0,
    };

    try {
      await onSubmit(dto);
      handleClose();
    } catch (err: any) {
      setError(err?.message ?? 'Error al registrar. Intenta de nuevo.');
    }
  }, [
    cadastralKey, meterNumber, exactAddress, accountNumber, installationDate,
    longitude, latitude, connectionDiameter, serviceType,
    solicitudId, registratorId, contractId, onSubmit, handleClose,
  ]);

  return (
    <WoModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Registro Catastral — Activación de Servicio"
      subtitle={`OT: ${orderCode} · Fase 14`}
      color="#f97316"
    >
      <form onSubmit={handleSubmit} className="wo-cadastral__form" noValidate>

        {/* ── Banner informativo ── */}
        <div className="wo-cadastral__banner">
          <Info size={14} />
          <span>
            Este formulario activa el servicio en el catastro de EPAA.
            Completa todos los campos <strong>obligatorios (*)</strong> antes de
            confirmar la instalación.
          </span>
        </div>

        {/* ── Datos de identificación ── */}
        <fieldset className="wo-insp-report__fieldset">
          <legend className="wo-insp-report__legend">
            <Hash size={15} />
            Datos de Identificación
          </legend>

          <div className="wo-insp-report__grid-2">
            <div className="wo-modal-field">
              <label className="wo-modal-label" htmlFor="cad-key">
                Clave Catastral <span className="wo-modal-required">*</span>
              </label>
              <input
                id="cad-key"
                type="text"
                className="wo-modal-input"
                placeholder="Ej: 02-01-030-001-000-000-01"
                value={cadastralKey}
                onChange={(e) => setCadastralKey(e.target.value)}
                required
              />
            </div>

            <div className="wo-modal-field">
              <label className="wo-modal-label" htmlFor="cad-account">
                Número de Cuenta <span className="wo-modal-required">*</span>
              </label>
              <input
                id="cad-account"
                type="text"
                className="wo-modal-input"
                placeholder="Ej: 2026-00001"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>
          </div>
        </fieldset>

        {/* ── Datos del medidor ── */}
        <fieldset className="wo-insp-report__fieldset">
          <legend className="wo-insp-report__legend">
            <Gauge size={15} />
            Medidor e Instalación
          </legend>

          <div className="wo-insp-report__grid-2">
            <div className="wo-modal-field">
              <label className="wo-modal-label" htmlFor="cad-meter">
                Número de Medidor <span className="wo-modal-required">*</span>
              </label>
              <input
                id="cad-meter"
                type="text"
                className="wo-modal-input"
                placeholder="Ej: MED-2026-000123"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                required
              />
            </div>

            <div className="wo-modal-field">
              <label className="wo-modal-label" htmlFor="cad-diam">
                Diámetro de Conexión
              </label>
              <select
                id="cad-diam"
                className="wo-modal-input"
                value={connectionDiameter}
                onChange={(e) => setConnectionDiameter(e.target.value)}
              >
                <option value="">— Seleccionar —</option>
                <option value='1/2"'>1/2"</option>
                <option value='3/4"'>3/4"</option>
                <option value='1"'>1"</option>
                <option value='1 1/2"'>1 1/2"</option>
                <option value='2"'>2"</option>
              </select>
            </div>
          </div>

          <div className="wo-insp-report__grid-2">
            <div className="wo-modal-field">
              <label className="wo-modal-label" htmlFor="cad-type">
                Tipo de Servicio
              </label>
              <select
                id="cad-type"
                className="wo-modal-input"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="RESIDENCIAL">Residencial</option>
                <option value="COMERCIAL">Comercial</option>
                <option value="INDUSTRIAL">Industrial</option>
                <option value="OFICIAL">Oficial</option>
              </select>
            </div>

            <div className="wo-modal-field">
              <label className="wo-modal-label" htmlFor="cad-date">
                Fecha de Instalación <span className="wo-modal-required">*</span>
              </label>
              <input
                id="cad-date"
                type="date"
                className="wo-modal-input"
                value={installationDate}
                onChange={(e) => setInstallationDate(e.target.value)}
                required
              />
            </div>
          </div>
        </fieldset>

        {/* ── Dirección exacta ── */}
        <fieldset className="wo-insp-report__fieldset">
          <legend className="wo-insp-report__legend">
            <MapPin size={15} />
            Ubicación
          </legend>

          <div className="wo-modal-field">
            <label className="wo-modal-label" htmlFor="cad-address">
              Dirección Exacta <span className="wo-modal-required">*</span>
            </label>
            <input
              id="cad-address"
              type="text"
              className="wo-modal-input"
              placeholder="Ej: Simón Bolívar y GGG, sector El Tejar"
              value={exactAddress}
              onChange={(e) => setExactAddress(e.target.value)}
              required
            />
          </div>

          {/* Coordenadas GPS (colapsable) */}
          <div
            className="wo-cadastral__toggle"
            onClick={() => setShowCoords(!showCoords)}
          >
            <span>Coordenadas GPS (opcional)</span>
            <ChevronDown
              size={14}
              style={{
                transform: showCoords ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          </div>

          {showCoords && (
            <div className="wo-insp-report__grid-2" style={{ marginTop: 8 }}>
              <div className="wo-modal-field">
                <label className="wo-modal-label" htmlFor="cad-lng">Longitud</label>
                <input
                  id="cad-lng"
                  type="number"
                  step="any"
                  className="wo-modal-input"
                  placeholder="-79.1234567"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </div>
              <div className="wo-modal-field">
                <label className="wo-modal-label" htmlFor="cad-lat">Latitud</label>
                <input
                  id="cad-lat"
                  type="number"
                  step="any"
                  className="wo-modal-input"
                  placeholder="-1.2345678"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </div>
            </div>
          )}
        </fieldset>

        {/* ── Registrador ── */}
        <fieldset className="wo-insp-report__fieldset">
          <legend className="wo-insp-report__legend">
            <User size={15} />
            Responsable del Registro
          </legend>
          <div className="wo-modal-field">
            <label className="wo-modal-label">Registrador (usuario autenticado)</label>
            <input
              type="text"
              className="wo-modal-input"
              value={registratorId}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
            <span className="wo-modal-hint">ID del usuario que confirma la instalación.</span>
          </div>
        </fieldset>

        {/* ── Error ── */}
        {error && (
          <div className="wo-insp-report__error">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Advertencia de consecuencia ── */}
        <div className="wo-cadastral__warning">
          <AlertCircle size={14} />
          <span>
            Al confirmar, la OT de instalación pasará a <strong>Completada</strong> y
            la solicitud de acometida será marcada como <strong>Instalación Ejecutada</strong>.
            Esta acción activa el servicio en el sistema catastral de EPAA.
          </span>
        </div>

        {/* ── Acciones ── */}
        <div className="wo-modal-actions">
          <button
            type="button"
            className="wo-modal-btn wo-modal-btn--secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="wo-modal-btn wo-modal-btn--primary"
            disabled={isLoading}
            id="wo-cadastral-submit-btn"
            style={{ background: '#f97316' }}
          >
            {isLoading ? 'Registrando…' : '✓ Confirmar Instalación'}
          </button>
        </div>
      </form>
    </WoModalShell>
  );
};
