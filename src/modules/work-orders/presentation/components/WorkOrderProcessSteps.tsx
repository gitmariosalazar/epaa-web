/**
 * WorkOrderProcessSteps — Presentation Component
 * Clean Architecture & SOLID Principles (SRP & OCP).
 * Renders process steps for Work Orders in both 'mini' (compact) and 'full' (expanded) variants.
 */
import React from 'react';
import {
  Inbox,
  User,
  ClipboardCheck,
  Wrench,
  FileText,
  ShieldCheck,
  Star,
  Check,
  X
} from 'lucide-react';
import { Tooltip } from '@/shared/presentation/components/common/Tooltip/Tooltip';
import './WorkOrderProcessSteps.css';

export interface StepItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

export const WORK_ORDER_STEPS: StepItem[] = [
  { key: 'recepcion', label: 'Recepción', icon: Inbox },
  { key: 'asignacion', label: 'Asignación', icon: User },
  { key: 'preparacion', label: 'Preparación', icon: ClipboardCheck },
  { key: 'ejecucion', label: 'Personal y Materiales', icon: Wrench },
  { key: 'evidencias', label: 'Evidencias', icon: FileText },
  { key: 'calidad', label: 'Calidad', icon: ShieldCheck },
  { key: 'cierre', label: 'Cierre', icon: Star }
];

export const getWorkOrderActiveStepIndex = (estadoCodigo: string): number => {
  const upper = (estadoCodigo || '').toUpperCase();
  if (upper === 'NOTIFICADA' || upper === 'PENDIENTE_ASIGNACION') return 0;
  if (upper === 'PENDIENTE') return 1;
  if (['ASIGNADA', 'PREPARACION', 'REVISION_RECHAZADA'].includes(upper)) return 2;
  if (['EN_PROCESO', 'EN_PROCESO_INSPECCION', 'EN_PROCESO_INSTALACION'].includes(upper)) return 3;
  if (['EJECUTADA', 'INSPECCION_EJECUTADA', 'INSTALACION_EJECUTADA'].includes(upper)) return 5;
  if (['COMPLETADA', 'INSPECCION_COMPLETADA', 'INSTALACION_COMPLETADA'].includes(upper)) return 7;
  return 0;
};

interface WorkOrderProcessStepsProps {
  estadoCodigo: string;
  variant?: 'mini' | 'full';
  className?: string;
}

export const WorkOrderProcessSteps: React.FC<WorkOrderProcessStepsProps> = ({
  estadoCodigo,
  variant = 'full',
  className = ''
}) => {
  const activeIndex = getWorkOrderActiveStepIndex(estadoCodigo);
  const activeStep = WORK_ORDER_STEPS[activeIndex] || WORK_ORDER_STEPS[0];

  if (variant === 'mini') {
    return (
      <div className={`wo-mini-stepper ${className}`} role="progressbar" aria-label={`Paso actual: ${activeStep.label}`}>
        {WORK_ORDER_STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;

          let statusClass = 'wo-mini-step--pending';
          if (isCompleted) statusClass = 'wo-mini-step--completed';
          if (isActive) statusClass = 'wo-mini-step--active';

          return (
            <React.Fragment key={step.key}>
              <Tooltip
                content={`Fase ${idx + 1}: ${step.label} ${isActive ? '(Actual)' : isCompleted ? '(Completada)' : ''}`}
                position="top"
                themeColor={isActive ? 'warning' : isCompleted ? 'success' : 'slate'}
              >
                <div className={`wo-mini-step-circle ${statusClass}`}>
                  {isCompleted ? <Check size={10} strokeWidth={3} /> : <StepIcon size={11} />}
                </div>
              </Tooltip>
              {idx < WORK_ORDER_STEPS.length - 1 && (
                <div className={`wo-mini-step-line ${idx < activeIndex ? 'wo-mini-step-line--completed' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`wo-card-stepper ${className}`} role="progressbar" aria-label="Progreso detallado de la Orden de Trabajo">
      {WORK_ORDER_STEPS.map((step, idx) => {
        const StepIcon = step.icon;
        const isCompleted = idx < activeIndex;
        const isActive = idx === activeIndex;
        const isPending = idx > activeIndex;

        let statusClass = 'wo-card-step--pending';
        if (isCompleted) statusClass = 'wo-card-step--completed';
        if (isActive) statusClass = 'wo-card-step--active';

        return (
          <div key={step.key} className={`wo-card-step-item ${statusClass}`}>
            <div className="wo-card-step-container">
              <div className="wo-card-step-circle">
                <StepIcon size={16} />
                {isCompleted && (
                  <div className="wo-card-step-badge wo-card-step-badge--completed">
                    <Check size={8} strokeWidth={3} />
                  </div>
                )}
                {isPending && (
                  <div className="wo-card-step-badge wo-card-step-badge--pending">
                    <X size={8} strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="wo-card-step-label">{step.label}</span>
            </div>
            {idx < WORK_ORDER_STEPS.length - 1 && (
              <div
                className={`wo-card-step-line ${idx < activeIndex ? 'wo-card-step-line--completed' : ''}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
