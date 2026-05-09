import React from 'react';
import { Maximize2 } from 'lucide-react';
import { useDashboardFocus } from './DashboardFocusContext';
import './DashboardMaximizeButton.css';

interface DashboardMaximizeButtonProps {
  disabled?: boolean;
  visible?: boolean;
}

export const DashboardMaximizeButton: React.FC<
  DashboardMaximizeButtonProps
> = ({ disabled = false, visible = true }) => {
  const { openFirstWidget } = useDashboardFocus();

  if (!visible) return null;

  return (
    <button
      onClick={openFirstWidget}
      className={`dashboard-maximize-btn ${disabled ? 'disabled' : ''}`}
      title="Enter Presentation Mode"
      disabled={disabled}
      aria-label="Enter Presentation Mode"
    >
      <Maximize2 size={24} />
    </button>
  );
};
