import React from 'react';
import { ResolveIncidentModal } from '@/modules/incidents/presentation/components/ResolveIncidentModal';
import type { CompletionPreStep } from './orderCompletionStrategies';

/** Datos producidos por el paso previo (extensible por origen). */
export interface CompletionPreStepResult {
  /** Evidencias (data URLs) a adjuntar a la OT antes de cerrarla. */
  evidenceDataUrls?: string[];
}

interface CompletionPreStepHostProps {
  step: CompletionPreStep;
  onCancel: () => void;
  /** Se invoca cuando el paso previo terminó con éxito → completar la OT. */
  onConfirmed: (result: CompletionPreStepResult) => void | Promise<void>;
}

/** Renderiza la UI del paso previo según su tipo (registry por `type`). */
export const CompletionPreStepHost: React.FC<CompletionPreStepHostProps> = ({
  step,
  onCancel,
  onConfirmed,
}) => {
  switch (step.type) {
    case 'RESOLVE_INCIDENT':
      return (
        <ResolveIncidentModal
          isOpen
          incidentId={step.incidentId}
          incidentCode={step.incidentCode}
          orderCode={step.orderCode}
          onClose={onCancel}
          onResolved={({ newImages }) => onConfirmed({ evidenceDataUrls: newImages })}
        />
      );
    case 'NONE':
    default:
      return null;
  }
};
