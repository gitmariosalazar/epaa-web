import React, { type ReactNode } from 'react';
import './Tooltip.css';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: TooltipPosition;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = ''
}) => {
  return (
    <div className={`tooltip-container ${className}`}>
      {children}
      <div className={`tooltip-box tooltip-${position}`}>{content}</div>
    </div>
  );
};
