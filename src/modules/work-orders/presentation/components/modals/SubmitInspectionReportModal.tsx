/**
 * SubmitInspectionReportModal — Presentation Layer
 *
 * Fase 8 del proceso de Acometidas: El técnico completa y sube
 * su informe de campo para una OT de inspección de factibilidad.
 *
 * Clean Architecture:
 *   - Presentación pura: recibe onSubmit como callback (DIP).
 *   - Sin lógica de negocio: toda validación vive en el UseCase.
 *
 * SOLID:
 *   SRP: única responsabilidad — capturar los datos del informe.
 *   OCP: extensible con nuevos campos sin romper el componente.
 *   DIP: onSubmit recibe el comando ya tipado; no conoce el repositorio.
 */
import React, { useState, useCallback } from 'react';
import {
  ClipboardCheck, MapPin, Ruler, AlertCircle, DollarSign,
  CheckCircle2, XCircle, AlertTriangle, FileText, ChevronDown,
} from 'lucide-react';
import { WoModalShell } from './WoModalShell';
import type { SubmitInspectionReportCommand } from '../../../domain/schemas/dto/commands/submit-inspection-report.command';

// ── Types ────────────────────────────────────────────────────────────────────
type InspectionResult = 'FACTIBLE' | 'NO_FACTIBLE' | 'CONDICIONADA';

interface SubmitInspectionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrderId: string;
  orderCode: string;
  solicitudId: string;
  technicianId: string;
  onSubmit: (cmd: SubmitInspectionReportCommand) => Promise<void>;
  isLoading?: boolean;
}

// ── Sub-component: ResultOption ──────────────────────────────────────────────
interface ResultOptionProps {
  value: InspectionResult;
  selected: InspectionResult;
  onChange: (v: InspectionResult) => void;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}

const ResultOption: React.FC<ResultOptionProps> = ({
  value, selected, onChange, icon, label, description, color,
}) => {
  const isSelected = selected === value;
  return (
    <label
      className={`wo-insp-report__result-option ${isSelected ? 'wo-insp-report__result-option--selected' : ''}`}
      style={isSelected ? { borderColor: color, background: `${color}12` } : {}}
      htmlFor={`wo-insp-result-${value}`}
    >
      <input
        type="radio"
        id={`wo-insp-result-${value}`}
        name="insp-result"
        checked={isSelected}
        onChange={() => onChange(value)}
        style={{ display: 'none' }}
      />
      <span style={{ color: isSelected ? color : 'var(--text-muted)' }}>
        {icon}
      </span>
      <div className="wo-insp-report__result-text">
        <span className="wo-insp-report__result-label" style={isSelected ? { color } : {}}>
          {label}
        </span>
        <span className="wo-insp-report__result-desc">{description}</span>
      </div>
    </label>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
export const SubmitInspectionReportModal: React.FC<SubmitInspectionReportModalProps> = ({
  isOpen,
  onClose,
  workOrderId,
  orderCode,
  solicitudId,
  technicianId,
  onSubmit,
  isLoading = false,
}) => {
  // ── Form state ─────────────────────────────────────────────────────────────
  const [result, setResult]                     = useState<InspectionResult>('FACTIBLE');
  const [networkDistanceM, setNetworkDistanceM] = useState('');
  const [connectionDiameter, setConnectionDiameter] = useState('');
  const [terrainConditions, setTerrainConditions]   = useState('');
  const [observations, setObservations]             = useState('');
  const [longitude, setLongitude]                   = useState('');
  const [latitude, setLatitude]                     = useState('');
  const [materialCost, setMaterialCost]             = useState('');
  const [laborCost, setLaborCost]                   = useState('');
  const [showCosts, setShowCosts]                   = useState(false);
  const [showCoords, setShowCoords]                 = useState(false);
  const [error, setError]                           = useState<string | null>(null);

  // ── Reset on close ─────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setResult('FACTIBLE');
    setNetworkDistanceM('');
    setConnectionDiameter('');
    setTerrainConditions('');
    setObservations('');
    setLongitude('');
    setLatitude('');
    setMaterialCost('');
    setLaborCost('');
    setShowCosts(false);
    setShowCoords(false);
    setError(null);
    onClose();
  }, [onClose]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cmd: SubmitInspectionReportCommand = {
      workOrderId,
      solicitudId,
      technicianId,
      result,
      completedStatusId: 9, // COMPLETADA en work_orders.cat_estado_orden
      networkDistanceM:   networkDistanceM  ? parseFloat(networkDistanceM)  : undefined,
      connectionDiameter: connectionDiameter.trim() || undefined,
      terrainConditions:  terrainConditions.trim()  || undefined,
      observations:       observations.trim()       || undefined,
      longitude:  longitude ? parseFloat(longitude) : undefined,
      latitude:   latitude  ? parseFloat(latitude)  : undefined,
      materialCost: materialCost ? parseFloat(materialCost) : undefined,
      laborCost:    laborCost    ? parseFloat(laborCost)    : undefined,
    };

    try {
      await onSubmit(cmd);
      handleClose();
    } catch (err: any) {
      setError(err?.message ?? 'Error al enviar el informe. Intenta de nuevo.');
    }
  }, [
    workOrderId, solicitudId, technicianId, result, networkDistanceM,
    connectionDiameter, terrainConditions, observations, longitude, latitude,
    materialCost, laborCost, onSubmit, handleClose,
  ]);

  return (
    <WoModalShell
      isOpen={isOpen}
      onClose={handleClose}
      title="Informe Técnico de Inspección"
      subtitle={`OT: ${orderCode}`}
      color="var(--accent)"
    >
      <form onSubmit={handleSubmit} className="wo-insp-report__form" noValidate>

        {/* ── Resultado técnico ────────────────────────────────────────────── */}
        <fieldset className="wo-insp-report__fieldset">
          <legend className="wo-insp-report__legend">
            <ClipboardCheck size={15} />
            Dictamen de Factibilidad <span className="wo-modal-required">*</span>
          </legend>

          <div className="wo-insp-report__results-grid">
            <ResultOption
              value="FACTIBLE"
              selected={result}
              onChange={setResult}
              icon={<CheckCircle2 size={22} />}
              label="Factible"
              description="El predio puede ser conectado a la red."
              color="var(--success, #22c55e)"
            />
            <ResultOption
              value="CONDICIONADA"
              selected={result}
              onChange={setResult}
              icon={<AlertTriangle size={22} />}
              label="Condicionada"
              description="Factible con condiciones técnicas."
              color="var(--warning, #f59e0b)"
            />
            <ResultOption
              value="NO_FACTIBLE"
              selected={result}
              onChange={setResult}
              icon={<XCircle size={22} />}
              label="No Factible"
              description="No puede conectarse en las condiciones actuales."
              color="var(--error, #ef4444)"
            />
          </div>
        </fieldset>

        {/* ── Datos técnicos ───────────────────────────────────────────────── */}
        <fieldset className="wo-insp-report__fieldset">
          <legend className="wo-insp-report__legend">
            <Ruler size={15} />
            Datos Técnicos
          </legend>

          <div className="wo-insp-report__grid-2">
            <div className="wo-modal-field">
              <label className="wo-modal-label" htmlFor="wo-insp-dist">
                Distancia a la red (m)
              </label>
              <input
                id="wo-insp-dist"
                type="number"
                min="0"
                step="0.1"
                className="wo-modal-input"
                placeholder="Ej: 12.5"
                value={networkDistanceM}
                onChange={(e) => setNetworkDistanceM(e.target.value)}
              />
            </div>

            <div className="wo-modal-field">
              <label className="wo-modal-label" htmlFor="wo-insp-diam">
                Diámetro de conexión
              </label>
              <select
                id="wo-insp-diam"
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

          <div className="wo-modal-field">
            <label className="wo-modal-label" htmlFor="wo-insp-terrain">
              Condiciones del terreno
            </label>
            <textarea
              id="wo-insp-terrain"
              className="wo-modal-input wo-modal-textarea"
              rows={2}
              placeholder="Ej: Terreno arcilloso, con vegetación densa, pendiente moderada..."
              value={terrainConditions}
              onChange={(e) => setTerrainConditions(e.target.value)}
            />
          </div>

          <div className="wo-modal-field">
            <label className="wo-modal-label" htmlFor="wo-insp-obs">
              <FileText size={13} style={{ display: 'inline', marginRight: 4 }} />
              Observaciones adicionales
            </label>
            <textarea
              id="wo-insp-obs"
              className="wo-modal-input wo-modal-textarea"
              rows={3}
              placeholder="Cualquier observación relevante del inspector sobre el predio, la red o el cliente..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>
        </fieldset>

        {/* ── Coordenadas (colapsable) ─────────────────────────────────────── */}
        <fieldset className="wo-insp-report__fieldset">
          <legend
            className="wo-insp-report__legend wo-insp-report__legend--toggle"
            onClick={() => setShowCoords(!showCoords)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <MapPin size={15} />
            Coordenadas GPS
            <ChevronDown
              size={14}
              style={{
                marginLeft: 'auto',
                transform: showCoords ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          </legend>

          {showCoords && (
            <div className="wo-insp-report__grid-2">
              <div className="wo-modal-field">
                <label className="wo-modal-label" htmlFor="wo-insp-lng">Longitud</label>
                <input
                  id="wo-insp-lng"
                  type="number"
                  step="any"
                  className="wo-modal-input"
                  placeholder="-79.1234567"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </div>
              <div className="wo-modal-field">
                <label className="wo-modal-label" htmlFor="wo-insp-lat">Latitud</label>
                <input
                  id="wo-insp-lat"
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

        {/* ── Costos estimados (colapsable) ────────────────────────────────── */}
        <fieldset className="wo-insp-report__fieldset">
          <legend
            className="wo-insp-report__legend wo-insp-report__legend--toggle"
            onClick={() => setShowCosts(!showCosts)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <DollarSign size={15} />
            Costos Estimados
            <ChevronDown
              size={14}
              style={{
                marginLeft: 'auto',
                transform: showCosts ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
              }}
            />
          </legend>

          {showCosts && (
            <div className="wo-insp-report__grid-2">
              <div className="wo-modal-field">
                <label className="wo-modal-label" htmlFor="wo-insp-mat">
                  Materiales ($)
                </label>
                <input
                  id="wo-insp-mat"
                  type="number"
                  min="0"
                  step="0.01"
                  className="wo-modal-input"
                  placeholder="0.00"
                  value={materialCost}
                  onChange={(e) => setMaterialCost(e.target.value)}
                />
              </div>
              <div className="wo-modal-field">
                <label className="wo-modal-label" htmlFor="wo-insp-labor">
                  Mano de obra ($)
                </label>
                <input
                  id="wo-insp-labor"
                  type="number"
                  min="0"
                  step="0.01"
                  className="wo-modal-input"
                  placeholder="0.00"
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                />
              </div>
            </div>
          )}
        </fieldset>

        {/* ── Error ────────────────────────────────────────────────────────── */}
        {error && (
          <div className="wo-insp-report__error">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* ── Aviso de flujo automático ─────────────────────────────────────── */}
        <div className="wo-insp-report__info-banner">
          <AlertTriangle size={14} />
          <span>
            Al enviar, la OT se cerrará y la solicitud de acometida pasará
            automáticamente a <strong>Informe en Revisión</strong> para dictamen del analista.
          </span>
        </div>

        {/* ── Acciones ─────────────────────────────────────────────────────── */}
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
            id="wo-insp-report-submit-btn"
          >
            {isLoading ? 'Enviando…' : '✓ Enviar Informe'}
          </button>
        </div>
      </form>
    </WoModalShell>
  );
};
