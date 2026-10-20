import React from 'react';
import { ResolveIncidentModal } from '@/modules/incidents/presentation/components/ResolveIncidentModal';
import { CompletionDescriptionModal } from '../components/modals/CompletionDescriptionModal';
import type { CompletionPreStep } from './orderCompletionStrategies';

/** Datos producidos por el paso previo (extensible por origen). */
export interface CompletionPreStepResult {
  /** Descripción obligatoria de finalización del trabajo para el backend. */
  description: string;
  /** Evidencias (Files) a adjuntar a la OT antes de cerrarla. */
  evidenceFiles?: File[];
  /** Evidencias (data URLs) a adjuntar a la OT antes de cerrarla. */
  evidenceDataUrls?: string[];
}

interface CompletionPreStepHostProps {
  step: CompletionPreStep;
  onCancel: () => void;
  /** Se invoca cuando el paso previo terminó con éxito → completar la OT. */
  onConfirmed: (result: CompletionPreStepResult) => void | Promise<void>;
  isLoading?: boolean;
}

/** Renderiza la UI del paso previo según su tipo (registry por `type`). */
export const CompletionPreStepHost: React.FC<CompletionPreStepHostProps> = ({
  step,
  onCancel,
  onConfirmed,
  isLoading = false,
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
          onResolved={({ newImages, description }) =>
            onConfirmed({
              description: description || 'Resolución del incidente asociado y cierre de OT.',
              evidenceDataUrls: newImages,
            })
          }
        />
      );

    case 'COMPLETION_DESCRIPTION':
      return (
        <CompletionDescriptionModal
          isOpen
          orderCode={step.orderCode}
          onClose={onCancel}
          isLoading={isLoading}
          onSubmit={({ description, files }) =>
            onConfirmed({
              description,
              evidenceFiles: files,
            })
          }
        />
      );

    case 'NONE':
    case 'BLOCKED':
    default:
      return null;
  }
};
