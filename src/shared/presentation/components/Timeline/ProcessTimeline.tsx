import React from 'react';
import { Check, X } from 'lucide-react';
import './ProcessTimeline.css';

export interface TimelineStep<T = string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
}

export interface ProcessTimelineProps<T = string> {
  steps: TimelineStep<T>[];
  currentStep: T;
}

export const ProcessTimeline = <T extends string>({
  steps,
  currentStep
}: ProcessTimelineProps<T>) => {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="process-timeline-horizontal">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <React.Fragment key={step.id}>
            <div className="process-timeline-horizontal__step">
              <div
                className={`process-timeline-horizontal__circle ${
                  isCompleted
                    ? 'process-timeline-horizontal__circle--completed'
                    : ''
                } ${isCurrent ? 'process-timeline-horizontal__circle--current' : ''} ${
                  isPending
                    ? 'process-timeline-horizontal__circle--pending'
                    : ''
                }`}
              >
                {/* Main icon inside the circle */}
                <div className="process-timeline-horizontal__main-icon">
                  {step.icon}
                </div>

                {/* Status Badges */}
                {isCompleted && (
                  <div className="process-timeline-horizontal__badge process-timeline-horizontal__badge--completed">
                    <Check size={10} strokeWidth={4} />
                  </div>
                )}
                {/* The user requested an 'x y rojo' for incomplete, which means pending */}
                {isPending && (
                  <div className="process-timeline-horizontal__badge process-timeline-horizontal__badge--pending">
                    <X size={10} strokeWidth={4} />
                  </div>
                )}
              </div>
              <span
                className={`process-timeline-horizontal__label ${
                  isCurrent || isCompleted
                    ? 'process-timeline-horizontal__label--active'
                    : ''
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`process-timeline-horizontal__line ${
                  index < currentIndex
                    ? 'process-timeline-horizontal__line--active'
                    : ''
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
