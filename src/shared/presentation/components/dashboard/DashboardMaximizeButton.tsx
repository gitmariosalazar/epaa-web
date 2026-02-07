import React from 'react';
import { Maximize2 } from 'lucide-react';
import { useDashboardFocus } from './DashboardFocusContext';
import './DashboardWidgetWrapper.css'; // Reuse button styles

export const DashboardMaximizeButton: React.FC = () => {
  const { openFirstWidget } = useDashboardFocus();

  return (
    <button
      onClick={openFirstWidget}
      className="dashboard-widget-expand-btn-fab fixed-global-fab"
      title="Enter Presentation Mode"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '56px',
        height: '56px',
        zIndex: 50
      }}
    >
      <Maximize2 size={24} />
    </button>
  );
};
