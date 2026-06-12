/**
 * WorkOrderSuccess — Pantalla de éxito tras crear una OT
 *
 * SRP : solo muestra el resultado, no conoce cómo se creó.
 */
import React from 'react';
import { CheckCircle, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/shared/presentation/components/Button/Button';

interface WorkOrderSuccessProps {
  codigoOrden:    string | null;
  onCreateAnother: () => void;
  onGoToProcess:   () => void;
}

export const WorkOrderSuccess: React.FC<WorkOrderSuccessProps> = ({
  codigoOrden,
  onCreateAnother,
  onGoToProcess,
}) => (
  <div className="wo-success">
    <div className="wo-success__icon-wrapper">
      <CheckCircle size={56} className="wo-success__icon" />
    </div>

    <h2 className="wo-success__title">¡Orden Creada Exitosamente!</h2>

    {codigoOrden && (
      <div className="wo-success__code-box">
        <span className="wo-success__code-label">Código de la OT</span>
        <span className="wo-success__code">{codigoOrden}</span>
      </div>
    )}

    <p className="wo-success__hint">
      La orden fue registrada en estado{' '}
      <span className="wo-badge wo-badge--notificada">NOTIFICADA</span>.<br />
      Dirígete al módulo de <strong>Procesar OT</strong> para continuar con la asignación y ejecución.
    </p>

    <div className="wo-success__actions">
      <Button
        id="btn-wo-success-new"
        variant="ghost"
        leftIcon={<Plus size={16} />}
        onClick={onCreateAnother}
      >
        Crear otra OT
      </Button>
      <Button
        id="btn-wo-success-process"
        variant="primary"
        rightIcon={<ArrowRight size={16} />}
        onClick={onGoToProcess}
      >
        Ir a Procesar OT
      </Button>
    </div>
  </div>
);
