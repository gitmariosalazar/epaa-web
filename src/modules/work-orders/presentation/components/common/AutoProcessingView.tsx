import React from 'react';
import './AutoProcessingView.css';

interface AutoProcessingViewProps {
  title?: string;
  subtitle?: string;
}

export const AutoProcessingView: React.FC<AutoProcessingViewProps> = ({
  title = 'Preparando la orden de trabajo...',
  subtitle = 'Esto tomará solo unos segundos',
}) => {
  return (
    <div className="wo-process-auto-view" role="status" aria-live="polite">
      <div className="wo-process-loading__spinner" aria-hidden="true" />
      <h3 className="wo-process-loading__title">{title}</h3>
      <p className="wo-process-loading__subtitle">{subtitle}</p>
    </div>
  );
};