/**
 * WorkOrderAdvancePanel — Panel de Avance de Estado de OT
 *
 * SRP : muestra las acciones disponibles para avanzar el estado de una OT.
 * OCP : agregar un nuevo estado = agregar entrada en TRANSICIONES (WorkOrderConfig).
 * DIP : recibe el estado actual y un callback; no sabe nada de HTTP.
 *
 * Muestra:
 *  - Transiciones disponibles desde el estado actual (botones de avance)
 *  - Si la OT de inspección puede subir informe, muestra ese botón también
 */
import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertTriangle, FileCheck2, CheckCircle2 } from 'lucide-react';
import { getNextEstados, getEstadoOrdenConfig } from '../WorkOrderConfig';
import type { NextEstadoOption } from '../WorkOrderConfig';
import './WorkOrderAdvancePanel.css';

interface Props {
  estadoActual: string;
  isSubmitting: boolean;
  /** Callback when user confirms a state transition */
  onAdvance: (nuevoEstado: string, comment: string) => Promise<void>;
  /** Optional: show inspection report button (only for inspection OTs in field) */
  onInspectionReport?: () => void;
  showInspectionReportBtn?: boolean;
}

export const WorkOrderAdvancePanel: React.FC<Props> = ({
  estadoActual,
  isSubmitting,
  onAdvance,
  onInspectionReport,
  showInspectionReportBtn = false,
}) => {
  const nextOptions = getNextEstados(estadoActual);
  const currentCfg  = getEstadoOrdenConfig(estadoActual);

  const [selected, setSelected] = useState<string>(nextOptions[0]?.estado ?? '');
  const [comment,  setComment]  = useState('');
  const [confirm,  setConfirm]  = useState(false);

  /**
   * SRP — sincroniza el estado seleccionado cuando estadoActual cambia
   * (e.g. después de que el padre recarga la OT y el panel recibe nuevo estado).
   * Sin este efecto, `selected` quedaría stale con el estado anterior.
   */
  useEffect(() => {
    const opts = getNextEstados(estadoActual);
    setSelected(opts[0]?.estado ?? '');
    setComment('');
    setConfirm(false);
  }, [estadoActual]);

  const selectedOption: NextEstadoOption | undefined =
    nextOptions.find((o) => o.estado === selected);

  const isTerminal  = nextOptions.length === 0;
  const isCancelada = selected === 'CANCELADA';

  const handleExecute = async () => {
    if (!selected) return;
    try {
      await onAdvance(
        selected,
        comment.trim() || `Transición manual: ${estadoActual} → ${selected}`,
      );
      // Reset solo si tuvo éxito (el padre actualiza estadoActual → useEffect lo resetea)
    } catch {
      // El padre ya muestra el toast de error; solo desbloqueamos la UI
      setConfirm(false);
    }
  };

  // ── Terminal state ─────────────────────────────────────────────────────────
  if (isTerminal) {
    return (
      <div className="wo-advance-panel wo-advance-panel--terminal">
        <CheckCircle2 size={18} style={{ color: currentCfg.color }} />
        <span>
          Orden en estado <strong style={{ color: currentCfg.color }}>{currentCfg.label}</strong>
          {' '}— no hay más transiciones disponibles.
        </span>
      </div>
    );
  }

  return (
    <div className="wo-advance-panel">
      <div className="wo-advance-panel__header">
        <ArrowRight size={16} />
        <span>Avanzar estado</span>
        <span
          className="wo-advance-panel__current"
          style={{ color: currentCfg.color, background: currentCfg.bg }}
        >
          {currentCfg.label}
        </span>
      </div>

      {/* ── Botones de transición ── */}
      <div className="wo-advance-panel__options">
        {nextOptions.map((opt) => (
          <button
            key={opt.estado}
            className={[
              'wo-advance-panel__opt-btn',
              selected === opt.estado   ? 'wo-advance-panel__opt-btn--selected' : '',
              opt.estado === 'CANCELADA'? 'wo-advance-panel__opt-btn--danger'   : '',
            ].filter(Boolean).join(' ')}
            style={
              selected === opt.estado
                ? { borderColor: opt.color, background: `${opt.color}18` }
                : {}
            }
            onClick={() => {
              setSelected(opt.estado);
              setConfirm(false);
            }}
            disabled={isSubmitting}
          >
            <span className="wo-advance-panel__opt-dot" style={{ background: opt.color }} />
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Comentario + doble confirmación ── */}
      {selectedOption && (
        <div className="wo-advance-panel__confirm">
          {isCancelada && (
            <div className="wo-advance-panel__warning">
              <AlertTriangle size={14} />
              <span>
                Esta acción <strong>cancela</strong> la orden. Agrega un motivo obligatorio.
              </span>
            </div>
          )}

          <textarea
            className="wo-advance-panel__comment"
            placeholder={
              isCancelada ? 'Motivo de cancelación (obligatorio)…' : 'Comentario opcional…'
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            disabled={isSubmitting}
          />

          {!confirm ? (
            <button
              className="wo-advance-panel__btn-confirm"
              style={{ background: selectedOption.color }}
              onClick={() => setConfirm(true)}
              disabled={isSubmitting || (isCancelada && !comment.trim())}
            >
              <ArrowRight size={14} />
              Confirmar → {selectedOption.label}
            </button>
          ) : (
            <div className="wo-advance-panel__confirm-row">
              <span className="wo-advance-panel__confirm-q">¿Estás seguro?</span>
              <button
                className="wo-advance-panel__btn-yes"
                style={{ background: selectedOption.color }}
                onClick={handleExecute}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando…' : 'Sí, avanzar'}
              </button>
              <button
                className="wo-advance-panel__btn-no"
                onClick={() => setConfirm(false)}
                disabled={isSubmitting}
              >
                No, volver
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Botón extra: Informe de inspección ── */}
      {showInspectionReportBtn && onInspectionReport && (
        <button
          className="wo-advance-panel__btn-report"
          onClick={onInspectionReport}
          disabled={isSubmitting}
        >
          <FileCheck2 size={14} />
          Subir Informe de Inspección
        </button>
      )}
    </div>
  );
};
