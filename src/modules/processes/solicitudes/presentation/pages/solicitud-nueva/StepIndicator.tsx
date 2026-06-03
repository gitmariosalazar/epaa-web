import React from 'react';
import { Check } from 'lucide-react';

interface StepConfig {
  id: number;
  label: string;
  icon: React.ReactNode;
}

interface StepIndicatorProps {
  step: number;
  steps: StepConfig[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ step, steps }) => {
  return (
    <div className="solicitud-steps">
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <div
            className={`solicitud-step ${step >= s.id ? 'solicitud-step--active' : ''} ${step > s.id ? 'solicitud-step--done' : ''}`}
          >
            <div className="solicitud-step__dot">
              {step > s.id ? <Check size={14} /> : s.icon}
            </div>
            <span className="solicitud-step__label">{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`solicitud-steps__line ${step > s.id ? 'solicitud-steps__line--done' : ''}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
